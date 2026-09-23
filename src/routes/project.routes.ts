import prisma from '../lib/prisma'
import { createCrudRouter } from '../lib/crud-factory'
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator'

const projectRouter = createCrudRouter(prisma.project, {
  createSchema: createProjectSchema,
  updateSchema: updateProjectSchema,
  include: { skills: true },
  orderBy: { order: 'asc' },
  toCreateInput: ({ skillIds, ...data }) => ({
    ...data,
    skills: skillIds ? { connect: skillIds.map((id) => ({ id })) } : undefined,
  }),
  toUpdateInput: ({ skillIds, ...data }) => ({
    ...data,
    skills: skillIds ? { set: skillIds.map((id) => ({ id })) } : undefined,
  }),
})

export default projectRouter