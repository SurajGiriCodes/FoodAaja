import axios from "axios";

export const getAll = async () => {
  const { data } = await axios.get("/api/restaurants");
  return data;
};

export const search = async (searchTerm) => {
  const { data } = await axios.get("/api/restaurants/search/" + searchTerm);
  return data;
};

export const getByID = async (restaurantId) => {
  try {
    // Make a GET request to fetch the restaurant data including menu items
    const { data } = await axios.get(`/api/restaurants/${restaurantId}`);
    return data;
  } catch (error) {
    // Handle errors, e.g., restaurant not found
    if (error.response && error.response.status === 404) {
      throw new Error("Restaurant not found");
    } else {
      throw new Error("An error occurred while fetching restaurant details.");
    }
  }
};

// Inside your foodService.js or a similar service file

export const searchMenuItems = (restaurantId, searchTerm) => {
  return fetch(
    `/api/restaurants/${restaurantId}/menu/search/${encodeURIComponent(
      searchTerm
    )}`
  )
    .then((response) => response.json())
    .then((data) => data.menu);
};

//ADD RESTUARENT
export const createRestaurant = async (values) => {
  try {
    // Pass a third argument with the headers property
    const { data } = await axios.post("/api/restaurants/restaurants", values, {
      headers: {
        // Set the content type header to "multipart/form-data"
        "Content-Type": "application/json",
      },
    });
    console.log("Received response:", data);
    return data;
  } catch (error) {
    console.error("Error creating restaurant:", error.message);
  }
};

//DELETE RESTAURENT
export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.delete(`/api/restaurants/${restaurantId}`);
    console.log("Restaurant deleted successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting restaurant:", error.message);
    throw error;
  }
};

//Edit Restaurent
export const updateRestaurant = async (restaurantId, updatedData) => {
  try {
    const response = await axios.put(
      `/api/restaurants/${restaurantId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to add a food item to a specific restaurant's menu
export const addFoodToRestaurant = async (restaurantId, foodData) => {
  try {
    // Make a POST request to add the food item to the specified restaurant
    const { data } = await axios.post(
      `/api/restaurants/${restaurantId}/menu`,
      foodData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Food item added successfully", data);
    return data;
  } catch (error) {
    console.error("Error adding food item to restaurant:", error.message);
    throw error;
  }
};

// Function to delete a food item from a specific restaurant's menu
export const deleteFoodFromRestaurant = async (restaurantId, foodId) => {
  try {
    // Make a DELETE request to remove the food item from the specified restaurant
    const response = await axios.delete(
      `/api/restaurants/${restaurantId}/menu/${foodId}`
    );
    console.log("Food item deleted successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting food item from restaurant:", error.message);
    throw error;
  }
};

// Function to update a food item in a specific restaurant's menu
export const updateFoodInRestaurant = async (
  restaurantId,
  foodId,
  updatedFoodData
) => {
  try {
    // Make a PUT request to update the food item in the specified restaurant
    const response = await axios.put(
      `/api/restaurants/${restaurantId}/menu/${foodId}`,
      updatedFoodData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Food item updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating food item in restaurant:", error.message);
    throw error;
  }
};

export const getAllTags = async (restaurantId) => {
  const { data } = await axios.get(`/api/restaurants/${restaurantId}/tags`);
  return data;
};

export const getAllRestaurantIds = async (restaurantId) => {
  const { data } = await axios.get("/api/restaurants/all-restaurant-ids");
  return data;
};

export const getFilteredRestaurants = async (maxPrice) => {
  try {
    const response = await fetch(
      `/api/restaurants/filtered?maxPrice=${maxPrice}`
    );
    // Check if the response is ok (status in the range 200–299)
    if (!response.ok) {
      // Throw an error with the status text, which will be caught by the catch block
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    // Here, we assume the response is valid JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error or handle it as needed
    console.error("There has been a problem with your fetch operation:", error);
    // Optionally, throw the error again or return a default value
    throw error; // Or return default value, e.g., return [];
  }
};

// Function to search food items by name, subcategories, and price range
export const searchFoodItems = async (searchTerm, minPrice, maxPrice) => {
  try {
    // Make a GET request to the searchFoodItems endpoint with the searchTerm, minPrice, and maxPrice as query parameters
    const response = await axios.get("/api/restaurants/searchFoodItems", {
      params: { searchTerm, minPrice, maxPrice },
    });
    // Return the data from the response
    return response.data;
  } catch (error) {
    // Log and rethrow the error for the calling component to handle
    console.error("Error searching food items:", error);
    throw error;
  }
};

export const updateRestaurantRatings = async (restaurantRatings) => {
  try {
    const response = await axios.put(`/api/restaurants/updateRatings`, {
      restaurantRatings,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating restaurant ratings: ${error.message}`);
  }
};
