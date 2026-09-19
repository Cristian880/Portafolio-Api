import { Request, Response, NextFunction } from 'express'
import { verifyAdminToken } from '../lib/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_token

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' })
  }

  try {
    const payload = verifyAdminToken(token)
    ;(req as any).admin = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}