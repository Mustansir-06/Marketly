import dotenv from "dotenv"
dotenv.config()
const config={
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    MONGO_URI:process.env.MONGO_URI,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    GROQ_API_KEY:process.env.GROQ_API_KEY,
    CLIENT_URL:process.env.CLIENT_URL
}
export default config