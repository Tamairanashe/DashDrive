const ratingService = require('../../services/mobile/rating.service');

/**
 * Trust & Ratings Controller
 */

exports.submitTripRating = async (req, res) => {
    try {
        const { tripId, ratedId, rating, comment } = req.body;
        const raterId = req.user.id; // From auth middleware

        if (!tripId || !ratedId || !rating) {
            return res.status(400).json({ success: false, message: "Missing required rating fields" });
        }

        const data = await ratingService.createRating({
            tripId,
            raterId,
            ratedId,
            rating,
            comment
        });

        return res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Submit Rating Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit rating"
        });
    }
};

exports.getPilotRating = async (req, res) => {
    try {
        const { driver_id } = req.params;
        const rating = await ratingService.getPilotRating(driver_id);

        return res.json({
            success: true,
            data: rating
        });
    } catch (error) {
        console.error("Get Pilot Rating Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pilot rating"
        });
    }
};
