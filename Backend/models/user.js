const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: 'user'
    }
})

userSchema.pre('save', async function(){
    try{
        this.password = await bcrypt.hash(this.password, 10)
    }catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
})

module.exports = mongoose.model('User', userSchema)