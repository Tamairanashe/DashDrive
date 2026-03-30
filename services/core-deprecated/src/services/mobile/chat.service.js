const supabase = require('../../config/supabase');

/**
 * Chat & Messaging Service
 */

exports.saveMessage = async ({ tripId, senderId, content }) => {
    console.log(`[ChatService] Saving message for trip ${tripId} by ${senderId}`);
    const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
            trip_id: tripId,
            sender_id: senderId,
            content: content
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

exports.getTripChatHistory = async (tripId) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
};

exports.markAsRead = async (messageIds) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .in('id', messageIds);

    if (error) throw error;
    return data;
};
