import { NextFunction, Request, Response } from "express";
import {  readAccessToken } from "../utils/auth.js";

export const authUser=(req:Request,res:Response,next:NextFunction)=>{
    try {
        const accesstoken=req.headers.authorization?.split(" ")[1]
        if(!accesstoken){
            return res.status(401).json({
                message:"accesstoken is required"
            })
        }
        const decoded=readAccessToken(accesstoken)
        req.user=decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message:"Invalid or expired accesstoken"
        })
    }
}