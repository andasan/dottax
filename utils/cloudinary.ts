import { config } from "@/lib/config";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
})

export default cloudinary