const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const checkConstraints = async () => {
    console.log("🔍 Checking Constraints...");

    const { data, error } = await supabase.rpc('get_constraints', { t_name: 'menu_categories' });
    if (error) {
        // If RPC isn't available, we can try a direct select on pg_constraint if permissions allow
        const { data: directData, error: directErr } = await supabase
            .from('pg_constraint')
            .select('conname, contype')
            .filter('conrelid', 'eq', "'public.menu_categories'::regclass");

        if (directErr) {
            console.log("❌ Could not check constraints directly. Trying generic query...");
            // Let's just try to insert a duplicate and see if it fails on constraint or index
        } else {
            console.log("Constraints:", directData);
        }
    } else {
        console.log("Constraints:", data);
    }

    // Simplest way: try a manual query to pg_constraint
    const { data: raw, error: rawErr } = await supabase.from('pg_catalog.pg_constraint').select('*').limit(1);
    // Note: Public roles usually can't see pg_catalog, but Service Role might.

    if (rawErr) {
        console.log("❌ Service role cannot read pg_catalog directly.");
    }
};

// Instead of checking, let's just make the seed script more resilient by finding existing IDs manually
checkConstraints();
