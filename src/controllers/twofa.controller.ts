import { Request, Response } from 'express'
import { generateSecret, verify, generateURI } from 'otplib'
import QRCode from 'qrcode'
import prisma from '../lib/prisma'
import { asyncHandler } from '../lib/async-handler'
import { verify2FASetupSchema } from '../validators/twofa.validator'

// Protegido con requireAuth — solo un admin ya logueado puede iniciar la configuración
export const setup2FA = asyncHandler(async (req: Request, res: Response) => {
  const { email } = (req as any).admin

  const secret = generateSecret()
  const otpauthUrl = generateURI({ issuer: 'Portafolio Admin', label: email, secret })
  const qrCodeImageUrl = await QRCode.toDataURL(otpauthUrl)

  // El secret aún NO se guarda en la base de datos — solo se confirma
  // y persiste en el siguiente paso, cuando el usuario demuestra que
  // configuró correctamente su app autenticadora.
  res.json({ secret, qrCodeImageUrl })
})

// Protegido con requireAuth — confirma que el usuario escaneó bien el QR
export const confirm2FA = asyncHandler(async (req: Request, res: Response) => {
  const result = verify2FASetupSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const { adminId } = (req as any).admin
  const { secret, token } = result.data

    const verification = await verify({ token, secret })
    if (!verification.valid) {
        return res.status(400).json({ error: 'Código inválido' })
    }

  await prisma.adminUser.update({
    where: { id: adminId },
    data: { twoFactorSecret: secret, isTwoFactorEnabled: true },
  })

  res.json({ message: '2FA activado correctamente' })
})