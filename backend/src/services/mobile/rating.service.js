const supabase = require('../../config/supabase');

/**
 * Trust & Ratings Service
 */

/**
 * Create a new trip rating and trigger an async score refresh if the rated user is a driver.
 */
exports.createRating = async ({ tripId, raterId, ratedId, rating, comment }) => {
    const { data, error } = await supabase
        .from('trip_ratings')
        .insert([{
            trip_id: tripId,
            rater_id: raterId,
            rated_id: ratedId,
            rating: rating,
            comment: comment
        }])
        .select()
        .single();

    if (error) throw error;

    // Check if the rated user is a driver (to update cached rating)
    const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', ratedId)
        .maybeSingle();

    if (driver) {
        await this.syncPilotRating(driver.id, ratedId);
    }

    return data;
};

/**
 * Re-calculate a pilot's average rating and count, then cache it in the drivers table.
 */
exports.syncPilotRating = async (driverId, userId) => {
    const { data: ratings, error } = await supabase
        .from('trip_ratings')
        .select('rating')
        .eq('rated_id', userId);

    if (error) throw error;

    if (ratings.length > 0) {
        const total = ratings.reduce((sum, r) => sum + r.rating, 0);
        const average = parseFloat((total / ratings.length).toFixed(2));

        const { error: updateError } = await supabase
            .from('drivers')
            .update({
                rating: average,
                rating_count: ratings.length
            })
            .eq('id', driverId);

        if (updateError) console.error("Error syncing pilot rating:", updateError);
    }
};

/**
 * Fetch a pilot's public rating profile.
 */
exports.getPilotRating = async (driverId) => {
    const { data, error } = await supabase
        .from('drivers')
        .select('name, rating, rating_count')
        .eq('id', driverId)
        .single();

    if (error) throw error;
    return data;
};
