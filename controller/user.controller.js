import mongoose from "mongoose";
import userSchema from '../schema/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js";





const register=asyncHandler(async(req,res)=>{
    res.status(200).json({message:"OK"})
})












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

const login = async (req, res) => {
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




export { createUser, login,register }