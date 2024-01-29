import React, { useEffect, useState } from "react";
import { getAll } from "../../../services/foodService";
import AdminThumbnails from "../../AdminComponent/AdminThumbnails/AdminThumbnails";

function RestaurantPage() {
  return (
    <>
      <h1 style={{ marginBottom: "10px" }}>Restaurant</h1>
      <AdminThumbnails />
    </>
  );
}

export default RestaurantPage;
