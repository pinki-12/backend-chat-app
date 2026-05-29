import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./api/routes/authRoutes.js"
import chatRouter from "./api/routes/chatRoutes.js"
import messageRouter from "./api/routes/messageRoutes.js"
import cookieParser from "cookie-parser"

const app = express()

// config
dotenv.config()

// middleware
app.use(cors(
    {
        origin:["http://localhost:5173" , "http://127.0.0.1:5173" , "http://localhost:5174" ],
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser())

// routes
app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)
app.use("/api/messages", messageRouter)

export default app

