import { Request, Response } from "express"
import productModel from "../models/product.model.js"
import { uploadFiles } from "../services/storage.service.js"

export const createProductController = async (req: Request, res: Response) => {
    try {
        const { title, description, price, category, stock, sizes } = req.body
        const { id } = req.user!
        const files = req.files as Express.Multer.File[]
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }
        const uploadResults = await Promise.all(
            files.map((file) => uploadFiles(file.buffer))
        )
        const imageUrls = uploadResults.map((result) => result.url).filter((url): url is string => url !== undefined)

        const product = await productModel.create({
            title,
            description,
            images: imageUrls,
            price: {
                amount: price.amount,
                currency: price.currency
            },
            category,
            ...(category === "clothing" ? { sizes } : { stock }),
            seller: id
        })
        return res.status(201).json({
            message: "product created successfully",
            product
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const getAllProductsController=async(req:Request,res:Response)=>{
    try {
        const {search,sortBy,order,page = "1",limit = "10"}=req.query
        const filter: any={}
        if(search){
            filter.title={$regex:search as string,$options:"i"}
        }
        const sortOptions:any={}
        if(sortBy==="price"){
            sortOptions["price.amount"] = order === "desc" ? -1 : 1
        }else if(sortBy==="createdAt"){
            sortOptions["createdAt"] = order === "desc" ? -1 : 1
        }else{
            sortOptions["createdAt"]=-1
        }
        const pageNum=Math.max(parseInt(page as string),1)
        const limitNum=Math.max(parseInt(limit as string),1)
        const skip=limitNum*(pageNum-1)
        const [products,total]=await Promise.all([
            productModel.find(filter).sort(sortOptions).skip(skip).limit(limitNum).populate("seller", "name"),
            productModel.countDocuments(filter)
        ])
        return res.status(200).json({
            message:"products fetched successfully",
            products,
            pagination:{
                total,
                page:pageNum,
                limit:limitNum,
                totalPages:Math.ceil(total/limitNum)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
export const getByIdProductController=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        const product=await productModel.findById(id).populate("seller", "name")
        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }
        return res.status(200).json({
            message:"product fetched successfully",
            product
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
export const updateProductController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, description, price, category, stock, sizes } = req.body
        const product = await productModel.findOne({ seller: req.user!.id, _id: id })
        if (!product) {
            return res.status(403).json({
                message: "You are not allowed to update this product"
            })
        }
        const files = req.files as Express.Multer.File[] | undefined
        if (files && files.length > 0) {
            const uploadResults = await Promise.all(
                files.map((file) => uploadFiles(file.buffer))
            )
            const imageUrls = uploadResults
                .map((result) => result.url)
                .filter((url): url is string => url !== undefined)

            if (imageUrls.length !== files.length) {
                return res.status(500).json({ message: "One or more images failed to upload" })
            }
            product.images = imageUrls
        }
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (price?.amount !== undefined) product.price.amount = price.amount;
        if (price?.currency !== undefined) product.price.currency = price.currency;
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (sizes !== undefined) product.sizes = sizes;

        await product.save();
        return res.status(200).json({
            message: "Product updated successfully",
            product,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
export const deleteProductController=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params
        const product=await productModel.findOne({seller:req.user!.id,_id:id})
        if(!product){
            return res.status(403).json({
                message:"You are not allowed to delete this product"
            })
        }
        await productModel.findByIdAndDelete(id)
        return res.status(200).json({
            message:"product deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
export const getMyProductsController = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user!.id
        const { page = "1", limit = "10" } = req.query

        const pageNum = Math.max(parseInt(page as string), 1)
        const limitNum = Math.max(parseInt(limit as string), 1)
        const skip = limitNum * (pageNum - 1)

        const [products, total] = await Promise.all([
            productModel.find({ seller: sellerId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate("seller", "name"),
            productModel.countDocuments({ seller: sellerId })
        ])

        return res.status(200).json({
            message: "your products fetched successfully",
            products,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}