const supabase = require('../../config/supabase');
const paymentService = require('./payment.service');

/**
 * Prepaid Rides Service
 */

exports.getPackages = async () => {
    const { data, error } = await supabase
        .from('prepaid_packages')
        .select('*')
        .eq('is_active', true);

    if (error) throw error;
    return data;
};

exports.purchasePackage = async (userId, packageId) => {
    // 1. Get Package Details
    const { data: pkg, error: pkgErr } = await supabase
        .from('prepaid_packages')
        .select('*')
        .eq('id', packageId)
        .single();

    if (pkgErr || !pkg) throw new Error("Package not found");

    // 2. Get Wallet & Check Balance
    const wallet = await paymentService.getWallet(userId);
    if (wallet.balance < pkg.price) {
        throw new Error("Insufficient wallet balance to purchase this package");
    }

    // 3. Deduct from Wallet (Atomic RPC)
    const { error: debitErr } = await supabase.rpc('process_wallet_transaction', {
        p_wallet_id: wallet.id,
        p_type: 'payment',
        p_amount: -pkg.price,
        p_ref_type: 'prepaid_package',
        p_ref_id: packageId,
        p_metadata: { packageName: pkg.name, slots: pkg.ride_slots }
    });
    if (debitErr) throw debitErr;

    // 4. Add Slots to Driver
    const { data: driver, error: driverErr } = await supabase
        .from('drivers')
        .select('id, ride_slots')
        .eq('user_id', userId)
        .single();

    if (driverErr || !driver) throw new Error("Driver profile not found");

    const { data: updatedDriver, error: updateErr } = await supabase
        .from('drivers')
        .update({ ride_slots: (driver.ride_slots || 0) + pkg.ride_slots })
        .eq('id', driver.id)
        .select()
        .single();

    if (updateErr) throw updateErr;

    return {
        success: true,
        message: `Purchased ${pkg.name}! You now have ${updatedDriver.ride_slots} rides available.`,
        ride_slots: updatedDriver.ride_slots
    };
};

exports.decrementDriverSlot = async (pilotId) => {
    const { data: driver, error: fetchErr } = await supabase
        .from('drivers')
        .select('ride_slots')
        .eq('id', pilotId)
        .single();

    if (fetchErr || !driver) return; // Silent fail or handle error

    if (driver.ride_slots > 0) {
        await supabase
            .from('drivers')
            .update({ ride_slots: driver.ride_slots - 1 })
            .eq('id', pilotId);
    }
};
