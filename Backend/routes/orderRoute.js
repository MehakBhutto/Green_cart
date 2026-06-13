const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken');
const {
    addNewOrder,
    // editOrder,
    // deleteOrder,
    getAllOrder,
    completeOrder,
    getUserOrders
} = require('../controllers/orderController');

// Create order (authenticated user)
router.post('/create', checkToken, addNewOrder);
// Get orders for current user
router.get('/user', checkToken, getUserOrders);
// Admin: get all orders
router.get('/admin', checkToken, getAllOrder);
// Admin actions on orders
router.put('/admin/:orderId/complete', checkToken, completeOrder);
// router.put('/admin/:orderId', checkToken, editOrder);
// router.delete('/admin/:orderId', checkToken, deleteOrder);

module.exports = router;