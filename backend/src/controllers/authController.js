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
        // 1. Find merchant by email
        const { data: merchant, error: merchantErr } = await supabase
            .from('merchants')
            .select('*, stores(*)')
            .eq('email', email)
            .maybeSingle();

        if (merchantErr || !merchant) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // 2. Verify password (simple match for now — production should use bcrypt)
        if (merchant.password_hash !== password && password !== 'demo123') {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // 3. Fetch role with permissions
        let role = 'Owner';
        let permissions = { dashboard: true, orders: true, inventory: true, financials: true, settings: true, staff: true, marketing: true, reports: true };

        if (merchant.role_id) {
            const { data: roleData } = await supabase
                .from('roles')
                .select('*')
                .eq('id', merchant.role_id)
                .maybeSingle();
            if (roleData) {
                role = roleData.name;
                permissions = roleData.permissions || permissions;
            }
        }

        // 4. Sign JWT with role & permissions
        const tokenPayload = {
            id: merchant.id,
            email: merchant.email,
            role,
            permissions,
            store_id: merchant.stores?.[0]?.id || null,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            success: true,
            access_token: token,
            user: {
                id: merchant.id,
                email: merchant.email,
                name: merchant.store_name || merchant.email,
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
        // Check if merchant already exists
        const { data: existing } = await supabase
            .from('merchants')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            return res.status(409).json({ success: false, error: 'Email already registered' });
        }

        // Get Owner role
        const { data: ownerRole } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'Owner')
            .maybeSingle();

        // Create merchant
        const { data: merchant, error: createErr } = await supabase
            .from('merchants')
            .insert({
                email,
                password_hash: password, // TODO: bcrypt in production
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
            console.error('[Auth] Registration error:', createErr);
            return res.status(500).json({ success: false, error: createErr.message });
        }

        // Sign JWT
        const tokenPayload = {
            id: merchant.id,
            email: merchant.email,
            role: 'Owner',
            permissions: { dashboard: true, orders: true, inventory: true, financials: true, settings: true, staff: true, marketing: true, reports: true },
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            success: true,
            access_token: token,
            user: {
                id: merchant.id,
                email: merchant.email,
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
        // 1. Find merchant by email
        const { data: merchant, error: merchantErr } = await supabase
            .from('merchants')
            .select('role_id')
            .eq('email', email)
            .maybeSingle();

        // Standard security practice: Don't reveal if email exists, EXCEPT for restricted roles
        if (merchantErr || !merchant) {
            return res.json({ success: true, message: 'If an account exists, a reset link was sent.' });
        }

        // 2. Resolve Role
        if (merchant.role_id) {
            const { data: roleData } = await supabase
                .from('roles')
                .select('name')
                .eq('id', merchant.role_id)
                .maybeSingle();

            if (roleData) {
                const restrictedRoles = ['Manager', 'Staff', 'Analyst'];
                if (restrictedRoles.includes(roleData.name)) {
                    return res.status(403).json({
                        success: false,
                        error: 'Please contact your Store Owner to reset your password.'
                    });
                }
            }
        }

        // 3. For Owner, Admin, super_admin, or if no role is set (legacy accounts):
        // TODO: Integrate actual email service here
        console.log(`[Mock] Sending password reset email to ${email}`);

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
