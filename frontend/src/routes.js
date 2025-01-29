import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products";
import AuthenticationWrapper from "./pages/AuthenticationWrapper";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
import Orders from "./pages/Account/Orders";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import UserCreateProduct from "./pages/UserCreateProduct";
import Payment from "./pages/Checkout/Payment";
import Success from "./pages/Checkout/Success";
import UserProducts from "./pages/Account/UserProducts";
import Wishlist from "./store/favourites/Wishlist";
import CategoryManagement from "./pages/AdminPanel/CategoryManagement";
import ProductManagement from "./pages/AdminPanel/ProductManagement";
import UserManagement from "./pages/AdminPanel/UserManagement";
import OrderManagement from "./pages/AdminPanel/OrderManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShopApplicationWrapper />,
    children: [
      {
        path: "/",
        element: <Shop />,
      },
      {
        path: "/categories/:categoryType",
        element: <ProductListPage />,
      },
      {
        path: "/products/:slug",
        loader: loadProductBySlug,
        element: <ProductDetails />,
      },
      {
        path: "/cart-items",
        element: <Cart />,
      },
      {
        path: "/account-details/",
        element: <ProtectedRoute><Account /></ProtectedRoute>,
        children: [
          {
            path: "orders",
            element: <ProtectedRoute><Orders /></ProtectedRoute>,
          },
          {
            path: "products", // Domyślna zakładka
            index: true,
            element: <ProtectedRoute><UserProducts /></ProtectedRoute>,
          },
        ],
      },
      {
        path: "/wishlist",
        element: <ProtectedRoute><Wishlist /></ProtectedRoute>,
      },
      {
        path: "/checkout",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,
      },
      {
        path: "/payment",
        element: <ProtectedRoute><Payment /></ProtectedRoute>,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/orderConfirmed",
        element: <OrderConfirmed />,
      },
      {
        path: "/create-product",
        element: <ProtectedRoute><UserCreateProduct /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/v1/",
    element: <AuthenticationWrapper />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin/",
    element: <ProtectedRoute roles={['ROLE_ADMIN']}><AdminPanel /></ProtectedRoute>,
    children: [
      {
        path: "categories",
        element: <CategoryManagement />,
      },
      {
        path: "products",
        element: <ProductManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "orders",
        element: <OrderManagement />,
      },
    ],
  },
]);
