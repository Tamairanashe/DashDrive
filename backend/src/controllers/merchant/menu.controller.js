const menuService = require('../../services/merchant/menu.service');

/**
 * Merchant Menu Controller
 */

exports.addCategory = async (req, res) => {
    try {
        const { storeId, organizationId, name, rank } = req.body;
        if (!storeId || !name) return res.status(400).json({ success: false, message: "Missing required fields" });

        const category = await menuService.createCategory({ storeId, organizationId, name, rank });
        return res.json({ success: true, data: category });
    } catch (error) {
        console.error("Add Category Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { categoryId, name, description, price, imageUrl, tags } = req.body;
        if (!categoryId || !name || !price) return res.status(400).json({ success: false, message: "Missing required fields" });

        const item = await menuService.createMenuItem({ categoryId, name, description, price, imageUrl, tags });
        return res.json({ success: true, data: item });
    } catch (error) {
        console.error("Add Item Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStoreMenu = async (req, res) => {
    try {
        const { store_id } = req.params;
        const menu = await menuService.getStoreMenu(store_id);
        return res.json({ success: true, data: menu });
    } catch (error) {
        console.error("Get Menu Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        const updateData = req.body;

        const updated = await menuService.updateMenuItem(item_id, updateData);
        return res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Update Item Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
