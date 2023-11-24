import React, { useState } from "react";
import RestaurantForm from "./RestaurantForm/RestaurantFrom";
import FoodForm from "./Foodfrom/FoodForm";
import classes from "./admin.module.css";

const AdminDashboard = () => {
  return (
    <div className={classes.admin}>
      <h1>Admin Dashboard</h1>
      <RestaurantForm />
    </div>
  );
};

export default AdminDashboard;
