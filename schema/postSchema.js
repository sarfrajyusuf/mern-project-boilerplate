import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    postData: String,
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    date: {
        type:Date,
        default:Date.now()
    },
    content: String,
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]
}, { timestamps: true, })
const posts = mongoose.model('post', postSchema)

export default posts