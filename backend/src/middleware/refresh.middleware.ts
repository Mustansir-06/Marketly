import { NextFunction, Request, Response } from "express"
import { readRefreshToken } from "../utils/auth.js"

export const refreshUser=(req:Request,res:Response,next:NextFunction)=>{
    try {
        const refreshtoken=req.cookies.refreshtoken
        if(!refreshtoken){
            return res.status(401).json({
                message:"refreshtoken is required"
            })
        }
        const decoded=readRefreshToken(refreshtoken)
        req.user=decoded
        req.token=refreshtoken
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message:"invalid or expired refresh token"
        })
    }
}