import mongoose,{Document} from "mongoose";
interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    role: "user" | "seller",
    refreshToken?:string| null
}
const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type:String,
        required:true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"],
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","seller"],
        default:"user"
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})
const userModel=mongoose.model<IUser>("user",userSchema)
export default userModel