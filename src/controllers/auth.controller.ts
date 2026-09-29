import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generateSecret, generate, verify, generateURI } from 'otplib'
import prisma from '../lib/prisma'
import { signAdminToken, signPreAuthToken, verifyPreAuthToken } from '../lib/jwt'
import { asyncHandler } from '../lib/async-handler'
import { loginTwoFactorSchema } from '../validators/twofa.validator'

const isProduction = process.env.NODE_ENV === 'production'

function setAdminCookie(res: Response, token: string) {
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' })
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash)
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }

  if (admin.isTwoFactorEnabled) {
    const preAuthToken = signPreAuthToken(admin.id)
    return res.json({ requires2FA: true, preAuthToken })
  }

  const token = signAdminToken({ adminId: admin.id, email: admin.email })
  setAdminCookie(res, token)
  res.json({ email: admin.email })
})

export const loginTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  const result = loginTwoFactorSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  let payload
  try {
    payload = verifyPreAuthToken(result.data.preAuthToken)
  } catch {
    return res.status(401).json({ error: 'Sesión de verificación expirada, inicia sesión de nuevo' })
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.adminId } })
  if (!admin || !admin.twoFactorSecret) {
    return res.status(401).json({ error: 'Configuración de 2FA inválida' })
  }

  const verification  = await verify({ token: result.data.token, secret: admin.twoFactorSecret })
  if (!verification.valid) {
    return res.status(400).json({ error: 'Código incorrecto' })
  }

  const token = signAdminToken({ adminId: admin.id, email: admin.email })
  setAdminCookie(res, token)
  res.json({ email: admin.email })
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('admin_token')
  res.json({ message: 'Sesión cerrada' })
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ admin: (req as any).admin })
})