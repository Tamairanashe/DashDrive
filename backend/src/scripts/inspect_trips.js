const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const inspectTrips = async () => {
    console.log("🔍 Inspecting Trips Table Structure...");

    // Try to get one row to see columns
    const { data, error } = await supabase.from('trips').select('*').limit(1);

    if (error) {
        console.log("❌ Error selecting from trips:", error.message);
        if (error.message.includes('schema cache')) {
            console.log("⚠️ Schema cache is definitely staled/mismatched.");
        }
    } else if (data && data.length > 0) {
        console.log("✅ Columns found in 'trips':");
        Object.keys(data[0]).forEach(col => console.log(`  - ${col}`));
    } else {
        console.log("⚠️ Trips table is empty. Attempting a trial insertion to check columns...");
        const trialId = `TRIAL-${Date.now()}`;
        const { error: insertErr } = await supabase.from('trips').insert({
            external_id: trialId,
            status: 'pending'
        });

        if (insertErr) {
            console.log("❌ Trial Insertion Failed:", insertErr.message);
        } else {
            console.log("✅ Basic insertion succeeded. Fetching the inserted row...");
            const { data: newRow } = await supabase.from('trips').select('*').eq('external_id', trialId).single();
            console.log("Columns:", Object.keys(newRow).join(', '));
            // Clean up
            await supabase.from('trips').delete().eq('external_id', trialId);
        }
    }
};

inspectTrips();
