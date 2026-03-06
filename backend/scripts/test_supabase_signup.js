require('dotenv').config();
const supabase = require('../src/config/supabase');

async function testSupabaseSignUp() {
    console.log('--- Testing Supabase SignUp (example.com) ---');
    const email = 'test@example.com';
    const password = 'Password123!';
    
    console.log(`Email: ${email}`);
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    
    if (error) {
        console.error('❌ Supabase SignUp Error:', error.message);
        console.error('Full Error:', error);
    } else {
        console.log('✅ Supabase SignUp Success:', data.user.id);
    }
}

testSupabaseSignUp().catch(console.error);
