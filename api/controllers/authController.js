import { Auth } from "../models/authSchema.js"
import { genToken } from "../utils/genToken.js"
import mongoose from "mongoose"


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "all fields are required"
            })
        }
        // check existing user
        const userExist = await Auth.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                message: "user already exist"
            })
        }
        const user = Auth.create({
            name,
            email,
            password,
        })
        return res.status(201).json({
            message: "registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        // check existing user
        const user = await Auth.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }
        const matchPassword = await user.comparePassword(password)
        if (!matchPassword) {
            return res.status(400).json({
                message: "password is incorrect"
            })
        }
        // token
        const Token = await genToken(user._id, user.email, user.name)
        if (!Token) {
            return res.status(400).json({
                message: "token is not found"
            })
        }
        return res.status(200).cookie("token", Token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ==="development" ? false:true,
            sameSite: process.env.NODE_ENV ==="development" ? "strict":"none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
            .json({
                message: "signin successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}
export const logout = async(req,res) =>{
    try{
    return res.status(200).clearCookie("token",{
        httpOnly:true,
        secure: false,
        sameSite:"strict",
    })
    .json({
        message:"logout successfully"
    })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}
export const getUsers = async(req,res,next)=>{
    try{
    const users = await Auth.find({"_id" :{"$ne": new mongoose.Types.ObjectId(req.user.id)}}).select("-password")
    if(users.length === 0){
        return res.status(400).json({
            message:"no users found"
        })
    }
    return res.status(200).json({
        message:"success",
        data: users,
    })
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}
