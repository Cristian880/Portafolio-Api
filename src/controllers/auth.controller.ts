import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import { signAdminToken } from '../lib/jwt'

const isProduction = process.env.NODE_ENV === 'production'

export async function login(req: Request, res: Response) {
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

  const token = signAdminToken({ adminId: admin.id, email: admin.email })

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días, en milisegundos
  })

  res.json({ email: admin.email })
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('admin_token')
  res.json({ message: 'Sesión cerrada' })
}

export async function me(req: Request, res: Response) {
  res.json({ admin: (req as any).admin })
}