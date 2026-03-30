const supabase = require('../../config/supabase');

/**
 * Payment & Wallet Service
 */

exports.getWallet = async (userId) => {
    let { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code === 'PGRST116') {
        // Create wallet if not exists
        const { data: newWallet, error: createError } = await supabase
            .from('wallets')
            .insert([{ user_id: userId, balance: 0 }])
            .select()
            .single();

        if (createError) throw createError;
        return newWallet;
    }

    if (error) throw error;
    return data;
};

exports.getTransactionHistory = async (walletId) => {
    const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Process a Payment from Rider to Pilot/Platform
 */
exports.processTripPayment = async ({ tripId, riderId, pilotId, amount, commissionRate = 0.2 }) => {
    const commission = amount * commissionRate;
    const netAmount = amount - commission;

    // We use a transaction-like approach (manual sequence for now)
    // 1. Get Wallets
    const riderWallet = await this.getWallet(riderId);

    // In a real app, pilotId would map to a user_id via drivers table
    const { data: driver } = await supabase.from('drivers').select('user_id').eq('id', pilotId).single();
    if (!driver) throw new Error("Driver not found");
    const pilotWallet = await this.getWallet(driver.user_id);

    // 2. Perform Deductions & Credits
    // NOTE: In production, use a Postgres RPC/Function for atomicity

    // Rider Debit
    const { error: debitErr } = await supabase.rpc('process_wallet_transaction', {
        p_wallet_id: riderWallet.id,
        p_type: 'payment',
        p_amount: -amount,
        p_ref_type: 'trip',
        p_ref_id: tripId,
        p_metadata: { role: 'rider' }
    });
    if (debitErr) throw debitErr;

    // Pilot Credit
    const { error: creditErr } = await supabase.rpc('process_wallet_transaction', {
        p_wallet_id: pilotWallet.id,
        p_type: 'earning',
        p_amount: netAmount,
        p_ref_type: 'trip',
        p_ref_id: tripId,
        p_metadata: { role: 'pilot', gross: amount, commission }
    });
    if (creditErr) throw creditErr;

    return { success: true, commission, pilotEarnings: netAmount };
};

exports.requestPayout = async (userId, amount) => {
    const wallet = await this.getWallet(userId);
    if (wallet.balance < amount) throw new Error("Insufficient balance");

    const { data, error } = await supabase
        .from('payouts')
        .insert([{
            wallet_id: wallet.id,
            amount: amount,
            status: 'pending'
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};
