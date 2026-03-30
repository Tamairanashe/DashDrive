const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const checkTables = async () => {
    const tables = ['orders', 'order_items', 'menu_items', 'menu_categories', 'trips', 'drivers', 'users'];

    console.log("🔍 Checking Table Visibility...");

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ ${table.padEnd(15)}: ${error.message}`);
        } else {
            const columns = data.length > 0 ? Object.keys(data[0]) : "Empty Table";
            console.log(`✅ ${table.padEnd(15)}: Found (${typeof columns === 'string' ? columns : columns.join(', ')})`);
        }
    }
};

checkTables();
