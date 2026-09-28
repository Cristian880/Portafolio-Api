import { Request, Response } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import resend from '../lib/resend'
import { asyncHandler } from '../lib/async-handler'
import { forgotPasswordSchema, resetPasswordSchema } from '../validators/password-reset.validator'

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = forgotPasswordSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const admin = await prisma.adminUser.findUnique({ where: { email: result.data.email } })

  // Responde igual exista o no el admin — evita confirmar por enumeración
  // qué emails están registrados en tu sistema.
  if (!admin) {
    return res.json({ message: 'Si el email existe, se envió un enlace de recuperación' })
  }

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
    },
  })

  const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${rawToken}`

  await resend.emails.send({
    from: 'Portafolio Admin <onboarding@resend.dev>',
    to: admin.email,
    subject: 'Recupera el acceso a tu panel admin',
    html: `<p>Haz click en el siguiente enlace para restablecer tu contraseña (válido por 30 minutos):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  })

  res.json({ message: 'Si el email existe, se envió un enlace de recuperación' })
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = resetPasswordSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const tokenHash = hashToken(result.data.token)

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } })

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Token inválido o expirado' })
  }

  const passwordHash = await bcrypt.hash(result.data.newPassword, 12)

  await prisma.adminUser.update({
    where: { id: resetToken.adminId },
    data: { passwordHash },
  })

  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })

  res.json({ message: 'Contraseña actualizada correctamente' })
})