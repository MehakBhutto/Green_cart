const express = require('express');
require('./dotenv');
const app = express()
const authRoute = require('./routes/authRoute')
const orderRoute = require('./routes/orderRoute')
const productRoute = require('./routes/productRoute')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const path = require('path')
const cors = require('cors');
const fs = require('fs')
const PORT = process.env.PORT || 8080

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));


const allowedOrigins = ['http://localhost:5173'];

app.use(express.json()); 
app.use(cookieParser());
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin); // dynamically set origin
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/auth', authRoute)
app.use('/api/product', productRoute)
app.use('/api/order', orderRoute) 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})