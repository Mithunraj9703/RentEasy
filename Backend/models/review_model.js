import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userProfilePic: {
            type: String,
        },
        name: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
