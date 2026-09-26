import { Request, Response } from "express"
import userModel from "../models/user.model.js"
import { createAccessToken, createRefreshToken } from "../utils/auth.js"
import bcrypt from "bcryptjs"

export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        const isExists = await userModel.findOne({ email })
        if (isExists) {
            return res.status(409).json({
                message: "user already exists"
            })
        }
        const hashpassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            name,
            email,
            password: hashpassword
        })

        return res.status(201).json({
            message: "user created successfully",
            user: {
                name,
                email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentails"
            })
        }
        const isSame = await bcrypt.compare(password, user.password)
        if (!isSame) {
            return res.status(401).json({
                message: "Invalid Credentails"
            })
        }
        const accesstoken = createAccessToken({ id: user._id.toString(), role: user.role })
        const refreshtoken = createRefreshToken({ id: user._id.toString(), role: user.role })
        user.refreshToken = refreshtoken
        await user.save()
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: "user loggedin successfully",
            user: {
                name: user.name,
                email,
                role: user.role
            },
            accesstoken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const refreshController = async (req: Request, res: Response) => {
    try {
        const { id, role } = req.user
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        if (user.refreshToken !== req.token) {
            user.refreshToken = null
            await user.save()
            return res.status(401).json({
                message: "Invalid or reused refresh token"
            })
        }
        const newaccesstoken = createAccessToken({ id, role })
        const newrefreshtoken = createRefreshToken({ id, role })
        user.refreshToken = newrefreshtoken
        await user.save()
        res.cookie("refreshtoken", newrefreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: "token rotated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            accesstoken: newaccesstoken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const logoutController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        user.refreshToken = null
        await user.save()
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        return res.status(200).json({ message: "user loggedout succesfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const getMeController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({
            message: "user fetched successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}