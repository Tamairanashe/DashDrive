const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const resend = require('../config/resend');

const JWT_SECRET = process.env.JWT_SECRET || 'dashdrive_enterprise_secret';

/**
 * Merchant Login — Validates credentials against Supabase `merchants` table.
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    try {
        // 1. Sign in with Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authErr) {
            return res.status(401).json({ success: false, error: authErr.message });
        }

        const user = authData.user;

        // 2. Fetch merchant profile with roles
        // We removed stores(*) from here because it requires a defined foreign key in Supabase
        let { data: merchant, error: merchantErr } = await supabase
            .from('merchants')
            .select('*, roles(*)')
            .eq('id', user.id)
            .maybeSingle();

        if (merchantErr || !merchant) {
            // If not in merchants, check users table (from schema_dash_manager.sql)
            const { data: userData, error: userErr } = await supabase
                .from('users')
                .select('*, roles(*)')
                .eq('id', user.id)
                .maybeSingle();
            
            if (!userData) {
                console.error('[Auth] Profile not found for ID:', user.id, 'Errors:', { merchantErr, userErr });
                return res.status(404).json({ success: false, error: 'User profile not found' });
            }
            // Map userData to merchant format if necessary
            merchant = userData;
        }

        // 3. Fetch stores separately (Safer than a join if relations aren't perfect)
        let stores = [];
        try {
            // We use a simple query first. If you later add merchant_id to stores, 
            // you can update this to: .or(`merchant_id.eq.${user.id},organization_id.eq.${merchant.organization_id}`)
            const { data: storeData } = await supabase
                .from('stores')
                .select('*')
                .eq('organization_id', merchant.organization_id || '00000000-0000-0000-0000-000000000000');
            
            stores = storeData || [];
        } catch (err) {
            console.error('[Auth] Store fetch failed:', err.message);
        }
        
        merchant.stores = stores;

        const role = merchant.roles?.name || 'Staff';
        const permissions = merchant.roles?.permissions || {};

        // 3. Sign local JWT with role & permissions (optional, if backend still relies on it)
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role,
            permissions,
            store_id: merchant.stores?.[0]?.id || merchant.store_id || null,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            access_token: token,
            supabase_session: authData.session,
            user: {
                id: user.id,
                email: user.email,
                name: merchant.full_name || merchant.store_name || user.email,
                role,
                permissions,
                stores: merchant.stores || [],
                status: merchant.is_verified ? 'ACTIVE' : 'PENDING',
            },
        });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * Merchant Registration
 */
const register = async (req, res) => {
    const { email, password, storeName, phone, type, countryCode } = req.body;

    if (!email || !password || !storeName) {
        return res.status(400).json({ success: false, error: 'Email, password, and store name are required' });
    }

    try {
        console.log(`[Auth] Registering: ${email}`);
        // 1. Create user with Admin API to auto-confirm (since we use service role key)
        const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { storeName }
        });

        if (authErr) {
            console.error('[Auth] Supabase signup error:', authErr);
            return res.status(400).json({ success: false, error: authErr.message });
        }

        const user = authData.user;

        // 2. Get Owner role ID
        const { data: ownerRole } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'Owner')
            .maybeSingle();

        // 3. Create merchant profile linked to auth user
        const { data: merchant, error: createErr } = await supabase
            .from('merchants')
            .insert({
                id: user.id, // Use Supabase Auth User ID
                email,
                store_name: storeName,
                phone: phone || null,
                type: type || 'MART',
                country_code: countryCode || 'ZW',
                role_id: ownerRole?.id || null,
                is_verified: false,
            })
            .select()
            .single();

        if (createErr) {
            console.error('[Auth] Profile creation error:', createErr);
            // Consider deleting the auth user if profile creation fails?
            return res.status(500).json({ success: false, error: createErr.message });
        }

        // 4. Sign local JWT
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: 'Owner',
            permissions: { dashboard: true, orders: true, inventory: true, financials: true, settings: true, staff: true, marketing: true, reports: true },
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            success: true,
            access_token: token,
            supabase_session: authData.session,
            user: {
                id: user.id,
                email: user.email,
                name: storeName,
                role: 'Owner',
                status: 'PENDING',
            },
        });
    } catch (err) {
        console.error('[Auth] Registration error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * Merchant Forgot Password - Enforces Role-Based Reset Rules
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
        // 1. Fetch user role to decide on notification logic
        const { data: merchant } = await supabase
            .from('merchants')
            .select('id, role_id, roles(name), store_name')
            .eq('email', email)
            .maybeSingle();

        // 2. Send Reset Email via Supabase Auth (Standard for everyone now)
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });

        if (resetErr) {
            console.error('[Auth] Supabase reset error:', resetErr);
        }

        // 3. If restricted role, optionally notify Owner (if we had owner's email)
        if (merchant && merchant.roles) {
            const restrictedRoles = ['Manager', 'Staff', 'Analyst'];
            if (restrictedRoles.includes(merchant.roles.name)) {
                console.log(`[Auth] Password reset requested for staff member: ${email} (${merchant.roles.name})`);
                // Here we could send a Resend email to the store owner or admin
            }
        }

        return res.json({
            success: true,
            message: 'If an account exists, a reset link was sent.'
        });

    } catch (err) {
        console.error('[Auth] Forgot password error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

/**
 * Super User Email Recovery — Helps owners find their registered email via phone
 */
const recoverEmail = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    try {
        // 1. Find merchant by phone
        const { data: merchant, error: dbErr } = await supabase
            .from('merchants')
            .select('email, store_name, phone')
            .eq('phone', phone)
            .maybeSingle();

        if (dbErr || !merchant) {
            // Standard practice: Don't confirm if phone exists
            return res.json({ 
                success: true, 
                message: 'If a matching account exists, we have sent instructions to the registered owner.' 
            });
        }

        // 2. Send the "Found Your Email" message via Resend
        // Since we only have the registered email, we send it THERE (in case they forgot which one they used)
        if (resend) {
            await resend.emails.send({
                from: 'DashDrive Auth <auth@updates.dashdrive.co.zw>',
                to: merchant.email,
                subject: 'DashDrive Account Recovery',
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Account Recovery Details</h2>
                        <p>Hello <strong>${merchant.store_name || 'Merchant'}</strong>,</p>
                        <p>A request was made to recover the email associated with your DashDrive account.</p>
                        <p>Your registered email is: <strong>${merchant.email}</strong></p>
                        <p>If you did not request this, please secure your account immediately.</p>
                        <br/>
                        <p>Regards,<br/>DashDrive Security Team</p>
                    </div>
                `
            });
        } else {
            console.warn('[Auth] Email recovery skipped: RESEND_API_KEY not configured.');
        }

        // 3. For UX, return a masked version of the email in the response
        const [user, domain] = merchant.email.split('@');
        const maskedEmail = `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;

        return res.json({
            success: true,
            message: 'Account found. We have sent the full details to your email.',
            masked_email: maskedEmail
        });

    } catch (err) {
        console.error('[Auth] Recover email error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = { login, register, forgotPassword, recoverEmail };
