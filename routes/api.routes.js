import express from 'express'
const router = express.Router()
import { createUser, login, register } from '../controller/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'


router.route("/register").post(
    upload.fields([
        {name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}
    ]),
    register)
router.route("/create").post(createUser)
router.route("/login").post(login)


export default router