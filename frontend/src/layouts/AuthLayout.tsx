import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1d2925]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AuthLayout