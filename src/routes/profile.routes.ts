import { Router } from 'express'
import { getProfile, upsertProfile } from '../controllers/profile.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: Router = Router()

router.get('/', getProfile)
router.put('/', requireAuth, upsertProfile)

export default router
