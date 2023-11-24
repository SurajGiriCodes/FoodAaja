import { Router } from "express";
import { RestaurantModel } from "../models/restrurent.model.js";
import handler from "express-async-handler";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import express from "express";
import multer from "multer";
import path from "path";

const router = Router();

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MAX_FILE_SIZE_IN_BYTES = 100 * 1024 * 1024; // 100 MB

// Create a storage object using multer.diskStorage method
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Create a multer instance using multer function and pass the storage object as an option
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE_IN_BYTES,
  },
});

router.post(
  "/restaurants",
  upload.fields([
    { name: "restaurantImage", maxCount: 1 },
    { name: "menu[0][menuImage]", maxCount: 1 },
  ]),
  handler(async (req, res) => {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    try {
      const { name, location, rating, stars } = req.body;
      const menuArray = req.body.menu || [];
      console.log("menuArray:", menuArray);
      const restaurant = await RestaurantModel.findOne({ name });

      if (restaurant) {
        res
          .status(BAD_REQUEST)
          .send("Restaurant already exists, please enter a new one!");
        return;
      }

      const restaurantImage = req.files["restaurantImage"]
        ? req.files["restaurantImage"][0].path
        : null;

      const menuItems = menuArray.map((menuItem, i) => {
        const menuImage =
          req.files &&
          req.files[`menu[${i}][menuImage]`] &&
          req.files[`menu[${i}][menuImage]`][0].path;

        return {
          ...menuItem,
          menuImage,
        };
      });

      const newRestaurant = {
        name,
        location,
        rating,
        restaurantImage,
        stars,
        menu: menuItems,
      };

      const savedRestaurant = await RestaurantModel.create(newRestaurant);
      res.status(201).json(savedRestaurant);
      console.log("Restaurant saved:", savedRestaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

router.get(
  "/",
  handler(async (req, res) => {
    const restaurants = await RestaurantModel.find({});
    res.send(restaurants);
  })
);

router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find the restaurant by ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (restaurant) {
      //it responds with a JSON object containing the restaurant details and its menu.
      res.json({ ...restaurant.toJSON(), menu: restaurant.menu });
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    // Handle other errors
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
