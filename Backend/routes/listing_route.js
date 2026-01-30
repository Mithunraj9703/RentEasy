import express from 'express'
import { getAllListings, getListingById, createListing, updateListing, searchListings } from '../controllers/listing_controller.js'
import { protectRoute , adminRoute, ownerRoute, restrictTo,userRoute} from '../middleware/auth_middleware.js';

const router = express.Router();

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.get('/search/:key', searchListings);

router.post('/create-listing', protectRoute, ownerRoute, createListing);
router.put('/update-listing', protectRoute, ownerRoute, updateListing);
export default router;