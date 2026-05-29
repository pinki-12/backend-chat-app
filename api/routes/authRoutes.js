import express, { Router } from "express"
import { getUsers, logout, signin, signup } from "../controllers/authController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = Router()

//routes
router.post("/login", signin)
router.post("/register", signup)
router.post("/logout",logout)
router.get("/getUsers",protect,getUsers)

export default router


