import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import MenuPage from "./pages/Menu/MenuPage";
import FoodPage from "./pages/Food/foodPage";
import CartPage from "./pages/Cart/CartPage";
import LoginPage from "./pages/Login/LoginPage";
import AdminDashboard from "./Admin/AdminDashboard";
import RestaurantPage from "./Admin/Pages/RestaurantPage/RestaurantPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu/:restaurantId" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/restaurants" element={<RestaurantPage />} />
      <Route path="/foods" element={<FoodPage />} />
    </Routes>
  );
}
