import { z } from 'zod'

export const createExperienceSchema = z.object({
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  description: z.string().min(10),
  startDate: z.coerce.date(),// transforma la fecha de string a Date
  endDate: z.coerce.date().optional(),
  order: z.number().int().optional(),
})

export const updateExperienceSchema = createExperienceSchema.partial()