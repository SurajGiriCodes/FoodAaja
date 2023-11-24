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
      throw new Error("Resta urant not found");
    } else {
      throw new Error("An error occurred while fetching restaurant details.");
    }
  }
};

export const createRestaurant = async (form) => {
  try {
    // Pass a third argument with the headers property
    const { data } = await axios.post("/api/restaurants/restaurants", form, {
      headers: {
        // Set the content type header to "multipart/form-data"
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Received response:", data);
    return data;
  } catch (error) {
    console.error("Error creating restaurant:", error.message);
  }
};
