import { Router } from "express";
import { RestaurantModel } from "../models/restrurent.model.js";
import handler from "express-async-handler";

const router = Router();

router.post("/restaurants", async (req, res) => {
  try {
    // Extract the data from the request body
    const { name, location, rating, restaurantImageUrl, stars, menu } =
      req.body;

    // Create a new instance of the RestaurantModel
    const newRestaurant = {
      name,
      location,
      rating,
      restaurantImageUrl,
      stars,
    };

    const savedRestaurant = await RestaurantModel.create(newRestaurant);
    res.status(201).json(savedRestaurant);
    console.log("Restaurant saved:", savedRestaurant);
  } catch (error) {
    // Handle errors and respond with an error message
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (restaurant) {
      res.json({ ...restaurant.toJSON(), menu: restaurant.menu });
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//DELETE RESTAURENT FROM LIST
router.delete("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await RestaurantModel.findByIdAndDelete(restaurantId);
    if (result) {
      res.status(200).json({ message: "Restaurant successfully deleted" });
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//UPDATING RESTAURENT
router.put("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const updateData = req.body;

    // Find the restaurant by ID and update it
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      updateData,
      { new: true } // This option returns the updated document
    );

    if (updatedRestaurant) {
      res.status(200).json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
