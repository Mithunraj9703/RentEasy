import express from 'express'
import {
  getAllListingsToApprove,
  getAllUsers,
  getAllOwners,
  approveListing,
  rejectListing
} from '../controllers/admin_controller.js'
import { protectRoute, adminRoute, ownerRoute, restrictTo, userRoute } from '../middleware/auth_middleware.js';


const router = express.Router()

router.get('/listings/pending',protectRoute,adminRoute, getAllListingsToApprove)
router.get('/users',protectRoute,adminRoute, getAllUsers)
router.get('/owners',protectRoute,adminRoute, getAllOwners)
router.patch('/listings/:id/approve',protectRoute,adminRoute, approveListing)
router.patch('/listings/:id/reject',protectRoute,adminRoute, rejectListing)

export default router
