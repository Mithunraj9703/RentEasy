import express from 'express';
import Listing from '../models/listing_model.js';
import Review from '../models/review_model.js';


/* ALL FUNCTIONS ARE WORKING (AS CHECKED IN THE POSTMAN) ONLY THE LAST FUCNTION IS YET TO BE CHECKED */


//will be shown in the front page - when the user opens it
export const getAllListings = async (req, res) => {
    try {
        //alllow to fetch the reviws with it - can be remove if not wanted
        const listings = await Listing.find({
            status: "approved"
        });
        return res.status(200).json({
            listings
        })
    } catch (error) {
        console.log(`Error in getting all the listings: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const currListing = await Listing.findById(id).populate('reviews')
            .populate("owner", "name email");
        if (!currListing) {
            return res.status(400).json({
                message: 'Listing not found',
            });
        }
        res.status(200).json({
            currListing,
        });
    } catch (error) {
        console.log(`Error in getting the listing by Id: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const searchListings = async (req, res) => {
    try {
        const searchword = req.params.key;
        const { checkIn, checkOut } = req.query;

        // Base filter (always apply)
        let query = {
            status: "approved",
            isActive: true,
        };

        // If search word is provided, add address filter
        if (searchword && searchword.trim() !== "") {
            query.address = { $regex: searchword, $options: "i" };
        }

        const listings = await Listing.find(query);

        // If dates are provided, filter booked listings
        if (checkIn && checkOut) {
            const availableListings = [];

            for (const listing of listings) {
                const isBooked = await Booking.exists({
                    listing: listing._id,
                    status: { $in: ["pending", "confirmed"] },
                    checkIn: { $lt: new Date(checkOut) },
                    checkOut: { $gt: new Date(checkIn) },
                });

                if (!isBooked) {
                    availableListings.push(listing);
                }
            }

            return res.status(200).json({
                searchMatches: availableListings,
            });
        }

        // No dates → return all matches
        res.status(200).json({
            searchMatches: listings,
        });

    } catch (error) {
        console.log(`Error in searching for the listings: ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


//by the owner that will create the listing it will be save to the database and shown to the admin 
//dashboard then the admin will either select or deselect it
export const createListing = async (req, res) => {
    try {
        const { title, rent, address, available, type, description, images, extraInfo, perks } = req.body;

        // Title and rent is required
        if (!title || !rent) {
            return res.status(400).json({ message: "Title and rent are required" });
        }
        if (!address) {
            return res.status(400).json({ message: "Address cant be empty,please give address" });
        }

        //will be checked by the middleware also
        if (req.user.role !== 'owner') {
            return res.status(400).json({ message: "You are not autnerised to create the listing" });
        }
        // Create new listing
        const newListing = await Listing.create({
            owner: req.user.id,
            title,
            rent,
            address,
            perks: perks || [],
            available: available !== undefined ? available : true,
            extraInfo,
            type: type || "single",
            description: description || "",
            images: images || [],
            status: "pending"
        });

        res.status(201).json({
            listing: newListing,
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ message: "Server error while creating listing" });
    }
};

//update listings
//not yet checked in the postman
export const updateListing = async (req, res) => {
    try {
        const { id: listingId } = req.params;
        const userId = req.user.id;
        const { title, rent, available, type, description, images, extraInfo, perks } = req.body;

        // Check if listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        //Check if the logged-in user is the owner
        if (listing.owner.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to update this listing",
            });
        }

        // Update fields conditionally
        // if (title !== undefined) listing.title = title;
        // if (rent !== undefined) listing.rent = rent;
        // if (available !== undefined) listing.available = available;
        // if (type !== undefined) listing.type = type;
        // if (description !== undefined) listing.description = description;
        // if (images !== undefined) listing.images = images;
        // if (extraInfo !== undefined) listing.extraInfo = extraInfo;
        // if (perks !== undefined) listing.perks = perks;

        // // Save and respond
        // const updatedListing = await listing.save();

        // Track if critical fields changed
        let requiresReapproval = false;

        if (title !== undefined && title !== listing.title) {
            listing.title = title;
            requiresReapproval = true;
        }

        if (address !== undefined && address !== listing.address) {
            listing.address = address;
            requiresReapproval = true;
        }

        if (rent !== undefined && rent !== listing.rent) {
            listing.rent = rent;
            requiresReapproval = true;
        }

        if (type !== undefined && type !== listing.type) {
            listing.type = type;
            requiresReapproval = true;
        }

        if (description !== undefined && description !== listing.description) {
            listing.description = description;
            requiresReapproval = true;
        }

        if (images !== undefined) {
            listing.images = images;
            requiresReapproval = true;
        }

        if (perks !== undefined) listing.perks = perks;
        if (available !== undefined) listing.available = available;
        if (extraInfo !== undefined) listing.extraInfo = extraInfo;

        // Reset approval if needed
        if (requiresReapproval) {
            listing.status = "pending";
            listing.isActive = false;
        }

        const updatedListing = await listing.save();

        res.status(200).json({
            message: requiresReapproval
                ? "Listing updated and sent for admin re-approval"
                : "Listing updated successfully",
            listing: updatedListing,
        });

    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({
            message: "Server error while updating listing",
        });
    }
};
