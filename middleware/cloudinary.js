
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: "./config/.env" });

//I am putting those configurations in my .env file and put my .env file in .gitignore file to not push this file when i push my whole code to github.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;