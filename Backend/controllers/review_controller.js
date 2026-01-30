import express from 'express'
import Review from '../models/review_model.js';
import Listing from '../models/listing_model.js';


/* THIS FUCNTIONS ARE YET TO BE CHECKED IN THE POSTMAN */


export const getaAllReviews = async (req, res) => {
    try {
        const listingId = req.params.id;

        const listing = await Listing.findById(listingId).populate("reviews");

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const listingReviews = listing.reviews;
        res.status(200).json({
            reviews: listingReviews
        });

    } catch (error) {
        console.log("Error in getting all the review", err.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const createReview = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: listingId } = req.params;
        const userId = req.user._id;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Review text cannot be empty",
            });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({
                message: "Listing not found",
            });
        }

        // Create review
        const review = await Review.create({
            text: text.trim(),
            userId,
            userProfilePic: req.user.profilePic,
            name: req.user.name,
        });

        // Attach review to listing
        listing.reviews.push(review._id);
        await listing.save();

        res.status(201).json({
            review,
        });

    } catch (error) {
        console.error("Error in creating review:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const { id: listingId, reviewId } = req.params;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({  message: "Listing not found" });

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Only the review owner can delete
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        listing.reviews.pull(reviewId);
        await listing.save();

        await review.deleteOne();

        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        console.log("Error in creating review", err.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};


