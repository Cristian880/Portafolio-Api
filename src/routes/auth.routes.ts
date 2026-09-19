import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: Router = Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router