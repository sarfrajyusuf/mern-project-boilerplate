import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //File has been uploaded
        console.log("File has been uploaded", response.url)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log(error, "error&&&&&&&&&&&&&&&&&&&&&&&")
        fs.unlinkSync(localFilePath) //remove locally save temporry file as the upload failed
        return null
    }
}
