import {v2 as cloudinary} from 'cloudinary';
import EnvVars from '../config/EnvVars';

cloudinary.config({
    cloud_name : EnvVars.CLOUDINARY_CLOUD_NAME,
    api_key : EnvVars.CLOUDINARY_API_KEY,
    api_secret : EnvVars.CLOUDINARY_API_SECRET,
})

export default cloudinary