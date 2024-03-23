import axios from "axios";

export const createOrder = async (order) => {
  try {
    const { data } = await axios.post("/api/orders/create", order);
    return data;
  } catch (error) {}
};

export const getNewOrderForCurrentUser = async () => {
  const { data } = await axios.get("/api/orders/newOrderForCurrentUser");
  return data;
};

export const initiatePayment = async (paymentDetails) => {
  try {
    const { data } = await axios.post(
      "/api/orders/initiate-payment",
      paymentDetails
    );
    return data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

// Define the lookupPaymentStatus function
export const lookupPaymentStatus = async (orderId) => {
  try {
    // Make a request to the payment lookup endpoint
    const response = await axios.post(
      "/epayment/lookup/",
      { orderId }, // Assuming orderId is the parameter required for the lookup
      {
        headers: {
          Authorization: "Key d9d1a73af4364a73921020e145409c24", // Replace YOUR_AUTH_TOKEN with your actual authentication token
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the lookup process
    console.error("Error looking up payment status:", error);
    throw error;
  }
};

export const pay = async (paymentId) => {
  try {
    const { data } = await axios.put("/api/orders/pay", { paymentId });
    return data;
  } catch (error) {}
};

export const cashOnDelivery = async () => {
  try {
    const { data } = await axios.put("/api/orders/cashOnDelivery");
    return data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Server responded with error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received for the request:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
    throw error;
  }
};

export const trackOrderById = async (orderId) => {
  const { data } = await axios.get("/api/orders/track/" + orderId);
  return data;
};

export const getAllOrders = async (state) => {
  const { data } = await axios.get(`/api/orders/${state ?? ""}`);
  return data;
};

export const getAllStatus = async () => {
  const { data } = await axios.get("/api/orders/allstatus");
  return data;
};

export const getAllOrdersAdmin = async () => {
  try {
    const { data } = await axios.get("/api/orders");
    return data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error; // Re-throw the error for handling it in the calling component
  }
};

export const getUserOrders = async (userId) => {
  try {
    const { data } = await axios.get(`/api/orders/delivered-orders/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const submitRatingsToBackend = async (ratingsData) => {
  try {
    // Make a POST request to your backend API endpoint
    const response = await axios.put("/api/orders/submit-rating", {
      ratings: ratingsData,
    });

    // Handle success response if needed
    console.log("Ratings submitted successfully:", response.data);

    // Optionally, return the response data or any other indication of success
    return response.data;
  } catch (error) {
    // Handle error
    console.error("Failed to submit ratings:", error);

    // Optionally, rethrow the error to handle it in the calling code
    throw error;
  }
};

export const fetchDeliveryStatuses = async () => {
  try {
    const response = await axios.get("/api/orders/config/delivery-statuses"); // Adjust the URL as needed
    return response.data;
  } catch (error) {
    console.error("Failed to fetch delivery statuses:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (orderId, deliveryStatus) => {
  try {
    const response = await axios.put(
      `/api/orders/update-delivery-status/${orderId}`,
      { deliveryStatus }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update delivery status:", error);
    throw error;
  }
};
