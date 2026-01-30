import Booking from "../models/booking_model.js"
import Listing from "../models/listing_model.js"
import stripe from '../lib/stripe.js'


export const createBookingPayment = async (req, res) => {
    try {
        const { listingId, checkIn, checkOut, paymentMethod } = req.body;

        if (!listingId ||  !paymentMethod) {
            return res.status(400).json({ message: "Missing data,Check again" });
        }
        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: "Please give the CheckIn and CheckOut Dates" });
        }

        /* 🔒 Calculate price securely */
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const nights =
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            return res.status(400).json({ message: "Invalid dates" });
        }

        const totalPrice = nights * listing.rent;

        /* 📌 Create booking */
        const booking = await Booking.create({
            listing: listingId,
            user: req.user._id,//from the middleware
            checkIn,
            checkOut,
            totalPrice,
            paymentMethod,
            status: paymentMethod === "pay_on_reach" ? "confirmed" : "pending",
            paymentStatus: paymentMethod === "pay_on_reach" ? "pending" : "pending",
            //will be updated on the webhook
        });

        /* 💰 PAY ON REACH → NO STRIPE */
        if (paymentMethod === "pay_on_reach") {
            return res.status(201).json({
                message: "Booking confirmed. Pay on arrival.",
                bookingId: booking._id,
            });
        }

        /* 💳 PAY NOW → STRIPE PAYMENT INTENT */
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "inr",
            capture_method: "automatic", // immediate payment
            metadata: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            bookingId: booking._id,
        });
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Payment creation failed" });
    }
}

