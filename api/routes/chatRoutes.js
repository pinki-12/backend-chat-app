import express from "express"
import { createChat } from "../controllers/chatController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create",protect, createChat)

export default router