import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            maxLength: 200,
        },
        address: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        perks: [{ type: String }],
        rent: {
            type: Number,
            required: [true, "Rent price is required"],
        },
        available: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: ["single", "double", "family", "suite"],
            default: "single",
        },
        description: {
            type: String,
        },
        images: [
            {
                type: String, // list of image URLs
            },
        ],
        maxGuests: {
            type: Number,
        },
        extraInfo: {
            type: String,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
