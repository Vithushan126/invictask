import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlbpq0azo',
  api_key: process.env.CLOUDINARY_API_KEY || '991141648184729',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || '_ezijCF5poUPIkL8PLJbNmWw6Tk',
});

export { cloudinary };
