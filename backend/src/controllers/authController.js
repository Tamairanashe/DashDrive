const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

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

        // 2. Fetch merchant profile with roles and stores
        // Note: We check 'merchants' table first, fallback to 'users' if needed
        const { data: merchant, error: merchantErr } = await supabase
            .from('merchants')
            .select('*, stores(*), roles(*)')
            .eq('id', user.id)
            .maybeSingle();

        if (merchantErr || !merchant) {
            // If not in merchants, check users table (from schema_dash_manager.sql)
            const { data: userData } = await supabase
                .from('users')
                .select('*, roles(*)')
                .eq('id', user.id)
                .maybeSingle();
            
            if (!userData) {
                return res.status(404).json({ success: false, error: 'User profile not found' });
            }
            // Map userData to merchant format if necessary
            merchant = userData;
        }

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
        // 1. Sign up with Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signUp({
            email,
            password,
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
        // 1. Check for restricted roles BEFORE sending reset email via Supabase
        const { data: merchant } = await supabase
            .from('merchants')
            .select('role_id, roles(name)')
            .eq('email', email)
            .maybeSingle();

        if (merchant && merchant.roles) {
            const restrictedRoles = ['Manager', 'Staff', 'Analyst'];
            if (restrictedRoles.includes(merchant.roles.name)) {
                return res.status(403).json({
                    success: false,
                    error: 'Please contact your Store Owner to reset your password.'
                });
            }
        }

        // 2. Send Reset Email via Supabase Auth
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
        });

        if (resetErr) {
            // Standard practice: don't reveal if user exists unless error is critical
            console.error('[Auth] Supabase reset error:', resetErr);
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

module.exports = { login, register, forgotPassword };
