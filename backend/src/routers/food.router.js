import { Router } from "express";
import { RestaurantModel } from "../models/restrurent.model.js";
import { FoodModel } from "../models/food.model.js";
import handler from "express-async-handler";

const router = Router();
router.get("/searchFoodItems", async (req, res) => {
  try {
    // Retrieve search term and price range from query parameters
    const { searchTerm, minPrice, maxPrice } = req.query;

    // Convert minPrice and maxPrice to numbers
    const minPriceNum = Number(minPrice);
    const maxPriceNum = Number(maxPrice);

    // Find restaurants that have menu items matching the search term and price range
    const matchingRestaurants = await RestaurantModel.find({
      menu: {
        $elemMatch: {
          name: { $regex: searchTerm, $options: "i" },
          price: { $gte: minPriceNum, $lte: maxPriceNum },
        },
      },
    });

    // Extract matching menu items from the matching restaurants
    const matchingMenuItems = [];
    matchingRestaurants.forEach((restaurant) => {
      const matchedItems = restaurant.menu.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          item.price >= minPriceNum &&
          item.price <= maxPriceNum
      );
      // Add an object for each matched item that includes restaurant details and the item details
      matchedItems.forEach((item) => {
        matchingMenuItems.push({
          restaurant: {
            id: restaurant._id,
            name: restaurant.name,
            location: restaurant.location,
            rating: restaurant.rating,
          },
          menuItem: item,
        });
      });
    });

    // Respond with the matching menu items
    res.json(matchingMenuItems);
  } catch (error) {
    console.error("Error searching food items:", error);
    res
      .status(500)
      .json({ message: "Error searching food items", error: error.message });
  }
});

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

// Route to add a food item to a restaurant's menu
router.post("/:restaurantId/menu", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foodItem = req.body;

    // Find the restaurant and update its menu
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $push: { menu: foodItem } },
      { new: true } // Return the updated document
    );

    if (updatedRestaurant) {
      res.status(200).json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error("Error adding food item to restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a food item from a restaurant's menu
router.delete("/:restaurantId/menu/:foodId", async (req, res) => {
  try {
    const { restaurantId, foodId } = req.params;
    // Find the restaurant and remove the food item from its menu
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      { $pull: { menu: { _id: foodId } } },
      { new: true } // Return the updated document
    );

    if (updatedRestaurant) {
      res.status(200).json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant or food item not found" });
    }
  } catch (error) {
    console.error("Error deleting food item from restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a food item in a restaurant's menu
router.put("/:restaurantId/menu/:foodId", async (req, res) => {
  try {
    const { restaurantId, foodId } = req.params;
    const updatedFoodData = req.body;

    // Find the restaurant and update the specific food item in its menu
    const updatedRestaurant = await RestaurantModel.findOneAndUpdate(
      { _id: restaurantId, "menu._id": foodId },
      {
        $set: { "menu.$": updatedFoodData },
      },
      { new: true }
    );

    if (updatedRestaurant) {
      res.status(200).json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant or food item not found" });
    }
  } catch (error) {
    console.error("Error updating food item in restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/search/:searchTerm",
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, "i");

    const restaurents = await RestaurantModel.find({
      name: { $regex: searchRegex },
    });
    res.send(restaurents);
  })
);

// Route to search food items within a specific restaurant
router.get(
  "/:restaurantId/menu/search/:searchTerm",
  handler(async (req, res) => {
    const { restaurantId, searchTerm } = req.params;
    const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive regex for searching

    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    // Filter the menu based on the search term
    const filteredMenu = restaurant.menu.filter((item) =>
      searchRegex.test(item.name)
    );
    res.json({ menu: filteredMenu });
  })
);

// Add this endpoint in your restaurant or menu routes file
router.get("/api/restaurants/:restaurantId/tags", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await RestaurantModel.findById(restaurantId);
    const tags = new Set(); // Use a Set to ensure uniqueness
    restaurant.menu.forEach((item) => {
      item.tags.forEach((tag) => {
        tags.add(tag);
      });
    });
    res.json([...tags]); // Convert Set back to Array
  } catch (error) {
    res.status(500).send(error);
  }
});

// In your server's route handling file
router.get("/search", async (req, res) => {
  try {
    const { name, subcategories } = req.query;

    // Building the query
    const query = {
      $and: [
        { name: { $regex: name, $options: "i" } }, // Case-insensitive regex search for the name
        { "typeCategory.subcategories": { $in: subcategories.split(",") } }, // Assuming subcategories are passed as a comma-separated string
      ],
    };

    const foods = await FoodModel.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching food items", error });
  }
});

// Assuming 'foodRouter' is your Express router and FoodModel is your food item model

export default router;
