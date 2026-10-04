import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err)

  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición' })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Recurso no encontrado' })
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un registro con ese valor único' })
    }
  }

  res.status(500).json({ error: 'Error interno del servidor' })
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Ruta no encontrada' })
}