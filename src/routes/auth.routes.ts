import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { loginRateLimiter } from '../middlewares/rate-limit.middleware'
import { forgotPassword, resetPassword } from '../controllers/password-reset.controller'

const router: Router = Router()

router.post('/login',loginRateLimiter, login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

router.post('/forgot-password', loginRateLimiter, forgotPassword)
router.post('/reset-password', resetPassword)

export default router