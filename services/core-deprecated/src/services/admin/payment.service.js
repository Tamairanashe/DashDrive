const supabase = require("../../config/supabase");

/**
 * Uber-Style Payment & Financial Service
 */

exports.getPayouts = async (organizationId, { storeId, status }) => {
    let query = supabase
        .from("merchant_payouts")
        .select("*, stores(name)")
        .eq("organization_id", organizationId);

    if (storeId) {
        query = query.eq("store_id", storeId);
    }

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

exports.getInvoices = async (organizationId, { storeId, limit = 50 }) => {
    let query = supabase
        .from("merchant_invoices")
        .select("*, orders(customer_name, created_at)")
        .eq("organization_id", organizationId);

    if (storeId) {
        query = query.eq("store_id", storeId);
    }

    const { data, error } = await query.limit(limit).order("created_at", { ascending: false });

    if (error) throw error;
    return data;
};

// --- Bank Accounts ---

exports.getBankAccounts = async (organizationId) => {
    const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("organization_id", organizationId);

    if (error) throw error;
    return data;
};

exports.addBankAccount = async (bankData) => {
    const { data, error } = await supabase
        .from("bank_accounts")
        .insert([bankData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Tax Identities ---

exports.getTaxIdentity = async (organizationId) => {
    const { data, error } = await supabase
        .from("tax_identities")
        .select("*")
        .eq("organization_id", organizationId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Handle "No rows found"
    return data;
};

exports.updateTaxIdentity = async (organizationId, taxData) => {
    const { data, error } = await supabase
        .from("tax_identities")
        .upsert({
            ...taxData,
            organization_id: organizationId,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Summary & Analytics ---

exports.getFinancialSummary = async (organizationId, { storeId }) => {
    // Current Period Accruals
    let query = supabase
        .from("merchant_invoices")
        .select("net_amount, commission, tax, fees, status")
        .eq("organization_id", organizationId);

    if (storeId) {
        query = query.eq("store_id", storeId);
    }

    const { data: invoices, error } = await query;
    if (error) throw error;

    const summary = invoices.reduce((acc, inv) => {
        if (inv.status === 'unpaid') acc.pending_balance += Number(inv.net_amount);
        acc.total_commission += Number(inv.commission);
        acc.total_tax += Number(inv.tax);
        acc.total_fees += Number(inv.fees);
        return acc;
    }, { pending_balance: 0, total_commission: 0, total_tax: 0, total_fees: 0 });

    return summary;
};
