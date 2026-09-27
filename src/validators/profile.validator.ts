import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120),
  title: z.string().min(2).max(120),
  bio: z.string().min(10),
  avatarUrl: z.string().url().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
})