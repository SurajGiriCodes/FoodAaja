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

export default function AppRoutes() {
  const { user } = useAuth(); // Get the user object from the useAuth hook
  const isAdmin = user && user.isAdmin;
  return (
    <Routes>
      <Route
        path="/"
        element={isAdmin ? <RestaurantPageAdmin /> : <HomePage />}
      />
      <Route path="/menu/:restaurantId" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/restaurants" element={<RestaurantPageAdmin />} />
      <Route path="/adminMenu/:restaurantId" element={<MenuPageAdmin />} />
      <Route path="/food" element={<FoodPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}