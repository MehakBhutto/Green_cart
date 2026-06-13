const Order = require('../models/order')
const User = require('../models/user')
const mongoose = require('mongoose')

// Create a new order (authenticated user)
const addNewOrder = async (req, res) => {
    try {
        const { products, address, phoneNumber, totalPrice, firstName, lastName, email, zipcode, method } = req.body;

        // basic validation
        if (!Array.isArray(products) || !products.length) {
            return res.status(400).json({ success: false, message: 'Products array is required' });
        }

        // basic per-item validation (accept non-ObjectId ids as Mixed)
        for (const p of products) {
            if (!p.product) {
                return res.status(400).json({ success: false, message: 'Each product must include a product id' });
            }
            p.quantity = Number(p.quantity) || 1;
        }

        if (firstName && lastName && email && address && phoneNumber && totalPrice && method) {
            const newOrder = new Order({
                user: req.user?.id || null,
                products,
                address,
                phoneNumber,
                totalPrice,
                firstName,
                lastName,
                email,
                zipcode,
                method
            });

            await newOrder.save();
            return res.status(201).json({ success: true, message: 'Order created', data: newOrder });
        }

        return res.status(400).json({ success: false, message: 'Missing order data' });
        
    } catch (e) {
        console.error('addNewOrder error:', e);
        res.status(500).json({ success: false, message: e.message });
    }
}

// // Edit an order (admin only)
// const editOrder = async (req, res) => {
//     try {
//         const user = await User.findById(req.user?.id);
//         if (!user || user.role !== 'admin') {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }

//         const { orderId } = req.params;
//         const updates = req.body;
//         const order = await Order.findByIdAndUpdate(orderId, updates, { new: true });
//         if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
//         res.status(200).json({ success: true, message: 'Order updated', data: order });
//     } catch (e) {
//         res.status(500).json({ success: false, message: e.message });
//     }
// }

// // Delete an order (admin only)
// const deleteOrder = async (req, res) => {
//     try {
//         const user = await User.findById(req.user?.id);
//         if (!user || user.role !== 'admin') {
//             return res.status(403).json({ success: false, message: 'Forbidden' });
//         }

//         const { orderId } = req.params;
//         const removed = await Order.findByIdAndDelete(orderId);
//         if (!removed) return res.status(404).json({ success: false, message: 'Order not found' });
//         res.status(200).json({ success: true, message: 'Order deleted' });
//     } catch (e) {
//         res.status(500).json({ success: false, message: e.message });
//     }
// }

// Get orders for current user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
        const orders = await Order.find({ user: userId });
        res.status(200).json({ success: true, data: orders });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
}

// Get all orders (admin only)
const getAllOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
        const orders = await Order.find().populate('user', 'username email');
        res.status(200).json({ success: true, data: orders });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
}

// Mark order complete (admin only)
const completeOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { orderStatus: true }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, message: 'Order completed', data: order });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
}

module.exports = {
    addNewOrder,
    // editOrder,
    // deleteOrder,
    getAllOrder,
    completeOrder,
    getUserOrders
}