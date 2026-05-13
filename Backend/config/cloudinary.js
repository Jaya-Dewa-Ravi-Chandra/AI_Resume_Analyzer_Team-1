import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("CLOUDINARY CHECK:");
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY ? "API KEY FOUND" : "NO API KEY");
console.log(
  process.env.CLOUD_API_SECRET ? "SECRET FOUND" : "NO SECRET",
);

export default cloudinary;
