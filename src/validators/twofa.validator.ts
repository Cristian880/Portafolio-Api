import { z } from 'zod'

export const verify2FASetupSchema = z.object({
  secret: z.string().min(1),
  token: z.string().length(6),
})

export const loginTwoFactorSchema = z.object({
  preAuthToken: z.string().min(1),
  token: z.string().length(6),
})