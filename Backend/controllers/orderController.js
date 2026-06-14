const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/products')
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
        console.log(products)
        for (const p of products) {
            if (!p.product) {
                return res.status(400).json({ success: false, message: 'Each product must include a product id' });
            }
            p.name = p.name || 'Unknown Product';
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

        // fetch orders as plain objects to avoid populate casting errors
        const orders = await Order.find({ user: userId }).lean();

        // collect valid product ids
        const idSet = new Set();
        for (const order of orders) {
            for (const p of (order.products || [])) {
                const prod = p.product;
                if (typeof prod === 'string' && mongoose.Types.ObjectId.isValid(prod)) idSet.add(prod);
                else if (prod && typeof prod === 'object' && prod._id && mongoose.Types.ObjectId.isValid(String(prod._id))) idSet.add(String(prod._id));
            }
        }

        const ids = Array.from(idSet);
        const prodDocs = ids.length ? await Product.find({ _id: { $in: ids } }).select('name image').lean() : [];
        const prodById = Object.fromEntries(prodDocs.map(p => [String(p._id), p]));

        const normalized = orders.map(order => ({
            ...order,
            products: (order.products || []).map(p => {
                let prodDoc = null;
                if (p.product && typeof p.product === 'object' && p.product._id && prodById[String(p.product._id)]) prodDoc = prodById[String(p.product._id)];
                else if (typeof p.product === 'string' && prodById[p.product]) prodDoc = prodById[p.product];
                else if (p.name) prodDoc = { name: p.name, image: p.image || [] };
                else if (typeof p.product === 'string' && !mongoose.Types.ObjectId.isValid(p.product)) prodDoc = { name: p.product };

                return { product: prodDoc ? { _id: prodDoc._id, name: prodDoc.name, image: prodDoc.image || [] } : null, quantity: p.quantity || 0 };
            })
        }));

        res.status(200).json({ success: true, data: normalized });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
}

// Get all orders (admin only)
const getAllOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user || user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });

        // fetch orders and populate user only; handle products safely
        const orders = await Order.find().populate('user', 'username email').lean();

        // collect product ids
        const idSet = new Set();
        for (const order of orders) {
            for (const p of (order.products || [])) {
                const prod = p.product;
                if (typeof prod === 'string' && mongoose.Types.ObjectId.isValid(prod)) idSet.add(prod);
                else if (prod && typeof prod === 'object' && prod._id && mongoose.Types.ObjectId.isValid(String(prod._id))) idSet.add(String(prod._id));
            }
        }

        const ids = Array.from(idSet);
        const prodDocs = ids.length ? await Product.find({ _id: { $in: ids } }).select('name image').lean() : [];
        const prodById = Object.fromEntries(prodDocs.map(p => [String(p._id), p]));

        const normalized = orders.map(order => ({
            ...order,
            products: (order.products || []).map(p => {
                let prodDoc = null;
                if (p.product && typeof p.product === 'object' && p.product._id && prodById[String(p.product._id)]) prodDoc = prodById[String(p.product._id)];
                else if (typeof p.product === 'string' && prodById[p.product]) prodDoc = prodById[p.product];
                else if (p.name) prodDoc = { name: p.name, image: p.image || [] };
                else if (typeof p.product === 'string' && !mongoose.Types.ObjectId.isValid(p.product)) prodDoc = { name: p.product };

                return { product: prodDoc ? { _id: prodDoc._id, name: prodDoc.name, image: prodDoc.image || [] } : null, quantity: p.quantity || 0 };
            })
        }));

        res.status(200).json({ success: true, data: normalized });
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