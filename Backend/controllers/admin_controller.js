import express from 'express'
import Listing from '../models/listing_model.js';
import User from '../models/user_model.js';


export const getAllListingsToApprove = async (req, res) => {
    try {
        const listings = await Listing.find({ status: "pending" });
        res.status(200).json({
            listings
        })
    } catch (error) {
        console.log(`Error in getting all the listings: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            users
        })
    } catch (error) {
        console.log(`Error in getting all the Users: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllOwners = async (req, res) => {
    try {
        const users = await User.find({ role: 'owner' })
            .select('-password')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            users
        })
    } catch (error) {
        console.log(`Error in getting all the Owner: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const approveListing = async (req, res) => {
    const { id } = req.params
    try {

        const listing = await Listing.findOneAndUpdate({ _id: id, status: 'pending' }, { status: 'approved' },
            { new: true }
        );

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found or already moderated'
            })
        }

        return res.status(200).json({
            message: 'Listing approved successfully',
            listing
        })
    } catch (error) {
        console.error('Error approving listing:', error.message)

        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export const rejectListing = async (req, res) => {
    const { id } = req.params
    try {

        const listing = await Listing.findOneAndUpdate(
            { _id: id, status: 'pending' },
            { status: 'rejected' },
            { new: true }
        )

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found or already moderated'
            })
        }

        return res.status(200).json({
            message: 'Listing rejected successfully',
            listing
        })
    } catch (error) {
        console.error('Error rejecting listing:', error)

        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
