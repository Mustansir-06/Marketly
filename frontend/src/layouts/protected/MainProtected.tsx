import { Navigate, Outlet } from "react-router"
import { useAuth } from "../../context/useAuth"
import Loading from "../../components/Loading"


const MainProtected = () => {
    let {user,isLoading}=useAuth()
    if(isLoading) return <Loading/>
    if(!user) return <Navigate to={"/"}/>
    return <Outlet/>
}

export default MainProtected
