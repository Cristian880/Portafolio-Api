import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno')
}

export interface AdminTokenPayload {
  adminId: string
  email: string
}
export interface PreAuthTokenPayload {
  adminId: string
  purpose: '2fa-pending'
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload
}

export function signPreAuthToken(adminId: string): string {
  return jwt.sign({ adminId, purpose: '2fa-pending' }, JWT_SECRET, { expiresIn: '5m' })
}

export function verifyPreAuthToken(token: string): PreAuthTokenPayload {
  const payload = jwt.verify(token, JWT_SECRET) as PreAuthTokenPayload
  if (payload.purpose !== '2fa-pending') {
    throw new Error('Token con propósito incorrecto')
  }
  return payload
}