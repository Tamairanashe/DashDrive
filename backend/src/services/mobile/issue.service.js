const supabase = require('../../config/supabase');

/**
 * Support & Issue Management Service
 */

/**
 * Report a new issue related to an order.
 */
exports.reportIssue = async ({ orderId, type, severity, notes }) => {
    const { data, error } = await supabase
        .from('order_issues')
        .insert([{
            order_id: orderId,
            type: type,
            severity: severity,
            resolution_notes: notes,
            status: 'open'
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update issue status or resolution notes.
 */
exports.updateIssue = async (issueId, { status, notes, assignedTo }) => {
    const updateData = {
        updated_at: new Date()
    };
    if (status) updateData.status = status;
    if (notes) updateData.resolution_notes = notes;
    if (assignedTo) updateData.assigned_to = assignedTo;

    const { data, error } = await supabase
        .from('order_issues')
        .update(updateData)
        .eq('id', issueId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch all issues for a specific order.
 */
exports.getOrderIssues = async (orderId) => {
    const { data, error } = await supabase
        .from('order_issues')
        .select('*')
        .eq('order_id', orderId);

    if (error) throw error;
    return data;
};
