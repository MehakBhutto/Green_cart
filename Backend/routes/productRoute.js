const express= require('express');
const router = express.Router()
const upload = require('../middleware/multer')
const checkToken = require('../middleware/checkToken')
const {
    addProduct,
    editProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    getProductBySearch,
    getProductByCategory,
    } 
    = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/public/:productId', getSingleProduct);
router.get("/public/search", getProductBySearch)
router.get('/public/:category', getProductByCategory)
router.post('/admin',  upload.array('images', 4), addProduct);
router.put('/admin/:productId',  upload.array('images', 4), editProduct);
router.delete('/admin/:productId',  deleteProduct);

module.exports = router