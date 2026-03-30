const supabase = require("../../config/supabase");
const jwt = require("jsonwebtoken");

/**
 * Mobile Auth Service with Dual-mode Role Detection
 */

exports.authenticateMobileUser = async (email, password) => {
    // 1. Authenticate with Supabase Auth
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw { status: 401, message: error.message };

    // 2. Resolve Dual Roles (Customer vs Driver)
    const { data: dbUser, error: dbErr } = await supabase
        .from("users")
        .select(`
            *,
            roles(name),
            drivers(id, status)
        `)
        .eq("id", user.id)
        .single();

    if (dbErr) throw dbErr;

    // 3. Generate Unified Token (JWT with role metadata)
    const token = jwt.sign({
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.roles?.name || 'customer',
        pilot_id: dbUser.drivers?.[0]?.id || null,
        is_pilot: !!dbUser.drivers?.[0]
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return {
        token,
        user: {
            id: dbUser.id,
            email: dbUser.email,
            full_name: dbUser.full_name,
            role: dbUser.roles?.name,
            is_pilot: !!dbUser.drivers?.[0],
            pilot_status: dbUser.drivers?.[0]?.status
        }
    };
};

exports.getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from("users")
        .select(`
            *,
            roles(name),
            drivers(*)
        `)
        .eq("id", userId)
        .single();

    if (error) throw error;
    return data;
};
