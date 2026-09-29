import { Router } from 'express'
import { login, logout, me, loginTwoFactor } from '../controllers/auth.controller'
import { setup2FA, confirm2FA } from '../controllers/twofa.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { loginRateLimiter } from '../middlewares/rate-limit.middleware'
import { forgotPassword, resetPassword } from '../controllers/password-reset.controller'

const router: Router = Router()

router.post('/login',loginRateLimiter, login)
router.post('/login-2fa', loginRateLimiter, loginTwoFactor)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

router.post('/2fa/setup', requireAuth, setup2FA)
router.post('/2fa/confirm', requireAuth, confirm2FA)

router.post('/forgot-password', loginRateLimiter, forgotPassword)
router.post('/reset-password', resetPassword)

export default router