import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { updateProfileSchema } from '../validators/profile.validator'
import { asyncHandler } from '../lib/async-handler'

export const getProfile = asyncHandler(async (_req: Request, res: Response) => {
  const profile = await prisma.profile.findFirst()
  if (!profile) return res.status(404).json({ error: 'Perfil no configurado aún' })
  res.json(profile)
})

export const upsertProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = updateProfileSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const existing = await prisma.profile.findFirst()
  const data = result.data as any

  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data })
    : await prisma.profile.create({ data })

  res.json(profile)
})