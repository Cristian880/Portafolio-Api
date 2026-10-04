import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10),
  imageUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  skillIds: z.array(z.string()).optional(),
})

export const updateProjectSchema = createProjectSchema.partial()