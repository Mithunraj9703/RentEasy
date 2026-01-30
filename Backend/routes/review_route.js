import express from 'express'
import { getaAllReviews, createReview, deleteReview } from "../controllers/review_controller.js";
import { protectRoute , adminRoute, ownerRoute, restrictTo,userRoute} from '../middleware/auth_middleware.js';

const router = express.Router();

// router.use(protectRoute());

//getting all the 
router.get('/:id',protectRoute, getaAllReviews);
router.post('/:id/create-review',protectRoute, createReview);
router.delete('/:id/delete-review/:reviewId',protectRoute, deleteReview);


export default router;