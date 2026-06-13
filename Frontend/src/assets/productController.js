const Products = require('../models/products');
const cloudinary = require('../config/cloudinary');

const addProduct = async(req, res) => {
   try{
    if(checkUser(req, res)!=true){
        return res.status(404).json({
            message: 'Unauhorize Access'
        })
    }
    const image = [];
    for(i=0; i<req.files.length; i++){
        const result = await cloudinary.uploader.upload(req.files[i].path);
        image[i].push(result.secure_url)
    }
    const {name, description, category, price, offerPrice} = req.body;
    if(name && description && category && price && image.length>0){
        const newProduct = new Product({image, name, description, category, price});
        await newProduct.save();
        return res.status(200).json({
            message: "Product created successfully!",
            data: newProduct
        })
    }
  }catch(e){
    return res.status(500).json({message: 'no produt added'})
   }
}

const editProduct = async(req, res) => {
    try{
        if(checkUser(req, res)!=true){
        return res.status(404).json({
            message: 'Unauhorize Access'
        })
    }
        const {productId} = req.params;
        const Product = await Product.findById(productId);
        const image = []
        if(Product){
            for(i=0; i<req.files.length; i++){
            const result = await cloudinary.uploader.upload(req.files[i].path,{
                public_id: Product.image[i].split('/').pop(),
                overwrite: true,
                invalidate: true
            });
            image.push(result.secure_url)
        }
            const {name, description, category, price, offerPrice} = req.body
            if(image.length>0 || name || description || category || price || offerPrice){
                const editedProduct = await Product.findByIdAndUpdate(productId, {
                    image, name, description, category, price}, {returnDocument: 'after'});
            }
            res.status(200).json({message: 'product edited'})
        }
    }catch(e){
        res.status(500).json({message: 'Product not edited'})
    }
}

const deleteProduct = async(req, res) => {
    try{
        if(checkUser(req, res)!=true){
        return res.status(404).json({
            message: 'Unauhorize Access'
        })
    }
        const {productId} = req.params;
        const deleteProduct = await Product.findByIdAndDelete(productId);
        for(const imageUrl of deletedProduct.image){
        const deleteImage = await cloudinary.uploader.destroy(
            {public_id: imageUrl.split('/').pop()})}
        res.status(200).json({
            message: 'Product Delete Successfully',
            data: productId
        })
    }
    catch(e){
        res.status(500).json({message: 'Product not edited'})
    }
}

const getAllProducts = async(req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            message: 'Good to Go',
            data: products
        })
    }catch(e){
        res.status(500).json({message: 'Stopped'})
    }
}

const getSingleProduct = async(req, res) => {
    try{
        const productId = req.params;
        const Product = await Product.findById(productId);
        res.status(200).json({
            message: 'Good Going',
            data: Product
        })
    }catch(e){
        res.status(500).json({message: 'Stopped'})
    }
}

const getProductByCategory = async(req, res) => {
    try{
        const {category} = req.params;
        const products = await Product.findMany({category});
        if(products){
            return res.status(200).json({
            message: 'Good Going',
            data: products
           })
        }
    }catch(e){
        res.status(500).json({message: 'Stopped'})
    }
}

const getProductBySearch = async(req, res) => {
    try{
        const name = req.query.q;
        const products = await Product.find({
            name: {
                $regex: name,
                $options: "i"
            }
        });
        if(products){
            return res.status(200).json({
            message: 'Good Going',
            data: products
           })
        }
    }catch(e){
        res.status(500).json({message: 'Stopped'})
    }
}

module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct,
    getProductByCategory,
    getProductBySearch
}

const checkUser = async(req, res) => {
    const {userId} = req.params;
    const user = await User.findOne({_id: userId})
    if(user.role == 'admin'){
        return true;
    }
}