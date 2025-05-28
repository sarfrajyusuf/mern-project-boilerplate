import mongoose from "mongoose";
import userSchema from '../schema/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../schema/userSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "../helpers/index.js";

const register = asyncHandler(async (req, res) => {
    const { userName, email, name, password } = req.body;

    // Validate required fields
    if ([userName, name, email, password].some(field => !field?.trim())) {
        return res.json(new ApiError(400, "All fields are required"))
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json(new ApiError(409, "User already exists"))
    }

    // Get avatar file path
    const avatarFile = req?.files?.avatar?.[0];
    if (!avatarFile?.path) {
        return res.json(new ApiError(400, "Avatar file is required"))
    }

    const coverImageFile = req?.files?.coverImage?.[0];

    // Upload files
    const avatarUpload = await uploadOnCloudinary(avatarFile.path);
    if (!avatarUpload?.url) {
        return res.json(new ApiError(400, "Failed to upload avatar to Cloudinary"))
    }

    let coverImageUrl = "";
    if (coverImageFile?.path) {
        const coverImageUpload = await uploadOnCloudinary(coverImageFile.path);
        coverImageUrl = coverImageUpload?.url || "";
    }

    // Create user
    const newUser = await User.create({
        name,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatarUpload.url,
        coverImage: coverImageUrl
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user.");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if ([email, password].some(field => !field?.trim())) {
            return res.json(new ApiError(400, "All fields are required"))
            // throw new ApiError(400, "All fields are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json(new ApiError(404, "User not found"))
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            return res.json(new ApiError(404, "Invalid user credentials"))
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    } catch (error) {
        return res.json(new ApiError(error))
    }

});

const createUser = async (req, res) => {
    try {
        const user = req.body;

        if (!user || !user.email || !user.password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const isAlreadyExist = await userSchema.findOne({ email: user.email });
        if (isAlreadyExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;

        const result = await userSchema.create(user);

        // Remove password before sending response
        const { password, ...userWithoutPassword } = result.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const login_ = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload (you can add roles, ids etc.)
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send token + basic user info (omit password)
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};




export { createUser, login, register }