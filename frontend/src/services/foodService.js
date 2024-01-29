import axios from "axios";

export const getAll = async () => {
  const { data } = await axios.get("/api/restaurants");
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
