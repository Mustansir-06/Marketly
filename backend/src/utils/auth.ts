import  jwt from "jsonwebtoken"
import config from "../config/config.js"
interface TokenPayload {
  id: string;
  role: string;
}
export const createAccessToken=({id,role}:TokenPayload)=>{
    return jwt.sign({id,role},config.ACCESS_TOKEN_SECRET!,{expiresIn:"15m"})
}
export const createRefreshToken=({id,role}:TokenPayload)=>{
    return jwt.sign({id,role},config.REFRESH_TOKEN_SECRET!,{expiresIn:"7d"})
}
export const readAccessToken=(token:string)=>{
    return jwt.verify(token,config.ACCESS_TOKEN_SECRET!)
}
export const readRefreshToken=(token:string)=>{
    return jwt.verify(token,config.REFRESH_TOKEN_SECRET!)
}