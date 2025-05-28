import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/index.js'
import router from './routes/api.routes.js'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
connectDB()
const app=express()
app.use(cors())
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v1/users", router);

app.get('/',(req,res)=>{
res.json('hello...')
})

// app.post('/create', async (req, res) => {
//     try {
//         const user = req.body;
//         // const{userName,email}=req.body
//         console.log(user,"user::::::::::::::::::::")
//         if(!user) return
//         const isAlreadyExist=await userSchema.findOne({email:user.email})
//         if (isAlreadyExist){
//             return res.json('User already exist.')
//         }
//         const hash = bcrypt.hash(user.password,10)
//         console.log(hash,"===================================================")
//         return
//         const result = await userSchema.create({ ...user, hash });

//         res.status(201).json(result);
//     } catch (error) { 
//         console.error(error);
//         res.status(400).json({ message: 'Error creating user', error: error.message });
//     }
// });
// app.post('/post', async (_, res) => {
//     try {
//         const post = await postSchema.create({
//             postData:"Hello Sarfraj",
//             user:"6826d0c2cbb2f8fcbf8fd520"
//         });
//         let user =await userSchema.findOne({ _id:"6826d0c2cbb2f8fcbf8fd520"})
//         user.posts.push(post._id)
//         await user.save()
//         res.status(201).json(post);
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Error creating user', error: error.message });
//     }
// });

app.listen(5000,()=>console.log('Server is running...'))