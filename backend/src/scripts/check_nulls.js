const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const checkNullability = async () => {
    console.log("🔍 Checking Nullability for order_items...");

    // We'll query information_schema.columns
    const { data, error } = await supabase
        .from('information_schema_columns') // This might not work via PostgREST directly unless exposed
        .select('*')
        .eq('table_name', 'order_items');

    if (error) {
        console.log("❌ Cannot read info schema directly. Falling back to trial insert.");
        // Try an insert with ONLY order_id and quantity to see what fails
        const { error: insertErr } = await supabase.from('order_items').insert({
            order_id: '00000000-0000-0000-0000-000000000000', // Invalid but check constraint
            quantity: 1
        });
        console.log("Trial Insert Error:", insertErr.message);
    } else {
        data.forEach(col => {
            console.log(`${col.column_name.padEnd(15)} | Nullable: ${col.is_nullable}`);
        });
    }
};

checkNullability();
