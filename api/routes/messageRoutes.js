import express from "express"
import { getMessages, sendMessage } from "../controllers/messageController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/get/:chatId", getMessages)
router.post('/send', protect, sendMessage)

export default router