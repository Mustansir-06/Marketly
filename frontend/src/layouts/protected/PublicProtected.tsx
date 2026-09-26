import { Navigate, Outlet } from "react-router"
import Loading from "../../components/Loading"
import { useAuth } from "../../context/useAuth"


const PublicProtected = () => {
  let {user,isLoading}=useAuth()
    if(isLoading) return <Loading/>
  if(user) return <Navigate to={"/browse"}/>
  return <Outlet/>
}

export default PublicProtected
