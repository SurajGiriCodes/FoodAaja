import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import MenuPage from "./pages/Menu/MenuPage";
import FoodPage from "./pages/Food/foodPage";
import CartPage from "./pages/Cart/CartPage";
import LoginPage from "./pages/Login/LoginPage";
import RestaurantPageAdmin from "./pages/Admin/RestaurantPageAdmin";
import MenuPageAdmin from "./pages/Admin/MenuPageAdmin";
import { useAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/Register/RegisterPage";
import AuthRoute from "./Component/AuthRoute/AuthRoute";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import OrderTrackPage from "./pages/OrderTrack/OrderTrackPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import OrderPage from "./pages/Orders/OrderPage";
import OrdersPageAdmin from "./pages/Admin/OrdersPageAdmin";
import AdminCheckOrderPage from "./pages/Admin/AdminCheckOrderPage";

export default function AppRoutes() {
  const { user } = useAuth(); // Get the user object from the useAuth hook
  const isAdmin = user && user.isAdmin;
  return (
    <div style={{ marginTop: "70px" }}>
      <Routes>
        <Route
          path="/"
          element={isAdmin ? <RestaurantPageAdmin /> : <HomePage />}
        />
        <Route path="/search/:searchTerm" element={<HomePage />} />
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
        <Route path="/menu/:restaurantId/:searchTerm" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/restaurants" element={<RestaurantPageAdmin />} />
        <Route path="/OrdersAdmin" element={<OrdersPageAdmin />} />
        <Route path="/OrderCheck" element={<AdminCheckOrderPage />} />
        <Route path="/adminMenu/:restaurantId" element={<MenuPageAdmin />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/checkout"
          element={
            <AuthRoute>
              <CheckoutPage />
            </AuthRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <AuthRoute>
              <PaymentPage />
            </AuthRoute>
          }
        />
        <Route
          path="/track/:orderId"
          element={
            <AuthRoute>
              <OrderTrackPage />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <ProfilePage />
            </AuthRoute>
          }
        />
        <Route
          path="/orders/:filter?"
          element={
            <AuthRoute>
              <OrderPage />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}
