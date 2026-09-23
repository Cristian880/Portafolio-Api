import { Router } from 'express'
import { ZodSchema } from 'zod'
import { requireAuth } from '../middlewares/auth.middleware'

interface PrismaDelegate {
  findMany: (args?: any) => Promise<any[]>
  findUnique: (args: any) => Promise<any>
  create: (args: any) => Promise<any>
  update: (args: any) => Promise<any>
  delete: (args: any) => Promise<any>
}

interface CrudOptions<CreateBody, UpdateBody> {
  createSchema: ZodSchema<CreateBody>
  updateSchema: ZodSchema<UpdateBody>
  toCreateInput: (body: CreateBody) => any
  toUpdateInput: (body: UpdateBody) => any
  include?: any
  orderBy?: any
}

function getIdParam(id: unknown): string | null {
  return typeof id === 'string' ? id : null
}

export function createCrudRouter<CreateBody, UpdateBody>(
  delegate: PrismaDelegate,
  options: CrudOptions<CreateBody, UpdateBody>
): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const items = await delegate.findMany({ orderBy: options.orderBy, include: options.include })
    res.json(items)
  })

  router.get('/:id', async (req, res) => {
    const id = getIdParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'ID inválido' })

    const item = await delegate.findUnique({ where: { id }, include: options.include })
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  })

  router.post('/', requireAuth, async (req, res) => {
    const result = options.createSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })

    const item = await delegate.create({
      data: options.toCreateInput(result.data),
      include: options.include,
    })
    res.status(201).json(item)
  })

  router.put('/:id', requireAuth, async (req, res) => {
    const id = getIdParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'ID inválido' })

    const result = options.updateSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })

    const item = await delegate.update({
      where: { id },
      data: options.toUpdateInput(result.data),
      include: options.include,
    })
    res.json(item)
  })

  router.delete('/:id', requireAuth, async (req, res) => {
    const id = getIdParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'ID inválido' })

    await delegate.delete({ where: { id } })
    res.status(204).send()
  })

  return router
}