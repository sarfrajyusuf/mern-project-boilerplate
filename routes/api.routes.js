import express from 'express'
const router = express.Router()
import { createUser, login, register } from '../controller/user.controller.js'


router.route("/register").post(register)
router.route("/create").post(createUser)
router.route("/login").post(login)


export default router