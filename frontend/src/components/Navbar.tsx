import { Link, NavLink } from "react-router"
import { useAuth } from "../context/useAuth"
import { api } from "../services/axiosInstance"

const Navbar = () => {
  const { user, setUser, setAccessToken } = useAuth()

  const handlelogout = async () => {
    try {
      await api.post("/api/auth/logout")
      setUser(null)
      setAccessToken(null)
    } catch (error) {
      console.log(error)
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition ${
      isActive
        ? "font-medium text-[#183c32]"
        : "text-stone-600 hover:text-[#183c32]"
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#183c32] text-sm font-bold text-white">
            M
          </div>

          <span className="text-lg font-semibold tracking-tight text-[#1d2925]">
            Marketly
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {!user && (
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
          )}

          <NavLink to="/browse" className={navLinkClass}>
            Store
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          {/* Cart for logged-in users */}
          {user && (
            <NavLink to="/main/cart" className={navLinkClass}>
              Cart
            </NavLink>
          )}

          {user?.role === "seller" && (
            <>
              <NavLink
                to="/main/my-products"
                className={navLinkClass}
              >
                My Products
              </NavLink>

              <NavLink
                to="/main/products/new"
                className={navLinkClass}
              >
                Sell
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hidden text-sm font-medium transition sm:block ${
                    isActive
                      ? "text-[#183c32]"
                      : "text-stone-700 hover:text-[#183c32]"
                  }`
                }
              >
                Log in
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2.5 text-sm font-medium text-white transition ${
                    isActive
                      ? "bg-[#102e27]"
                      : "bg-[#183c32] hover:bg-[#102e27]"
                  }`
                }
              >
                Get started
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-[#1d2925]">
                  {user.name}
                </p>

                <p className="text-xs capitalize text-stone-500">
                  {user.role}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce8df] text-sm font-semibold text-[#183c32]">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                type="button"
                onClick={handlelogout}
                className="hidden text-sm text-stone-500 transition hover:text-red-600 md:block"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar