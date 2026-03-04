const chatService = require('../../services/mobile/chat.service');

/**
 * Chat & Messaging Controller
 */

exports.getHistory = async (req, res) => {
    try {
        const { trip_id } = req.params;
        const history = await chatService.getTripChatHistory(trip_id);

        return res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error("Get Chat History Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history"
        });
    }
};

exports.markMessagesRead = async (req, res) => {
    try {
        const { message_ids } = req.body;
        if (!Array.isArray(message_ids)) {
            return res.status(400).json({ success: false, message: "Invalid message IDs" });
        }

        await chatService.markAsRead(message_ids);

        return res.json({
            success: true,
            message: "Messages marked as read"
        });
    } catch (error) {
        console.error("Mark Messages Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update message status"
        });
    }
};
