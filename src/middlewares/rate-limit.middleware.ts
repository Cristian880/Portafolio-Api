import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit'

export const loginRateLimiter: RateLimitRequestHandler  = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5,
  message: { error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})