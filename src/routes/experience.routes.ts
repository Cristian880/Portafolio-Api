import prisma from '../lib/prisma'
import { createCrudRouter } from '../lib/crud-factory'
import { createExperienceSchema, updateExperienceSchema } from '../validators/experience.validator'

const experienceRouter = createCrudRouter(prisma.experience, {
  createSchema: createExperienceSchema,
  updateSchema: updateExperienceSchema,
  orderBy: { order: 'asc' },
  toCreateInput: (data) => data,
  toUpdateInput: (data) => data,
})

export default experienceRouter