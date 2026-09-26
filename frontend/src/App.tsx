import { createBrowserRouter, RouterProvider, Navigate } from "react-router"
import PublicProtected from "./layouts/protected/PublicProtected"
import AuthLayout from "./layouts/AuthLayout"
import Home from "./common/Home"
import About from "./common/About"
import NotFound from "./common/NotFound"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import MainProtected from "./layouts/protected/MainProtected"
import MainLayout from "./layouts/MainLayout"
import ProductList from "./pages/products/ProductList"
import ProductDetail from "./pages/products/ProductDetail"
import ProductForm from "./pages/products/ProductForm"
import MyProducts from "./pages/products/MyProducts"
import Cart from "./pages/cart/Cart"
import CheckoutSuccess from "./pages/CheckoutSuccess"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicProtected />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            { path: "", element: <Home /> },
            { path: "register", element: <Register /> },
            { path: "login", element: <Login /> },
          ],
        },
      ],
    },
    {
      element: <MainLayout />,
      children: [
        { path: "browse", element: <ProductList /> },
        { path: "about", element: <About /> },
        { path: "products/:id", element: <ProductDetail /> },
      ],
    },
    {
      path: "/main",
      element: <MainProtected />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { path: "", element: <Navigate to="/browse" replace /> },
            { path: "products/new", element: <ProductForm /> },
            { path: "products/:id/edit", element: <ProductForm /> },
            { path: "my-products", element: <MyProducts /> },
            { path: "cart", element: <Cart /> },
            { path: "checkout/success", element: <CheckoutSuccess /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App