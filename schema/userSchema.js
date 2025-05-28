import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String //cloudinary url
        },
        watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }],
        age: {
            type: Number,
            min: 0,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'

        }],
    }, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const User = mongoose.model('User', userSchema);

export default User;
