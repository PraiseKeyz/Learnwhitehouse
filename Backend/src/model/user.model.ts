import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    middlename: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    currentLevel: {
        type: String,
        enum: ['100Lvl', '200Lvl', '300Lvl', '400Lvl', '500Lvl'],
        default: '100Lvl',
        required: true,
    },
    phone: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String,
    },
    department: {
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
      },
      verified: {
        type: Boolean,
        default: false
      },
      emailVerified: {
        type: Boolean,
        default: false
      },
      verificationToken: {
        type: String,
        unique: true,
        sparse: true,
        default: null,
      },
      verificationTokenExpiresAt: {
        type: Date,
        default: null
      }
}, {timestamps: true})


const User = mongoose.model<IUser>('User', userSchema);

export default User;