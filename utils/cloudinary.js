import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
    cloud_name: "sarfraj-app",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //File has been uploaded
        console.log("File has been uploaded", res.url)
        return res

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally save temporry file as the upload failed
        return null
    }
}

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     {
//         public_id: "olympic_flag"
//     },
//     function (error, result) { console.log(result) }
// )