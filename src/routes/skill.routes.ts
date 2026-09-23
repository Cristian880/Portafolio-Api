import prisma from '../lib/prisma'
import { createCrudRouter } from '../lib/crud-factory'
import { createSkillSchema, updateSkillSchema } from '../validators/skill.validator'

const skillRouter = createCrudRouter(prisma.skill, {
  createSchema: createSkillSchema,
  updateSchema: updateSkillSchema,
  toCreateInput: (data) => data,
  toUpdateInput: (data) => data,
})

export default skillRouter