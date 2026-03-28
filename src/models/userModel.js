import { verify } from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true , "Please provide a username"],
        unique: true,
        trim: true,
        maxlength: [20 , "Username should be less than 20 characters"]
    },
    email: {
        type: String,
        require: [true , "Please provide an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        require: [true , "Please provide a password"],
        minlength: [6 , "Password should be at least 6 characters"]
    },
    isVerifed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date 
})

const User = mongoose.models.users || mongoose.model('User' , userSchema);
export default User;