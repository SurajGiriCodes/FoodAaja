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
    const { data } = await axios.post("/api/payment/initiate", paymentDetails);
    return data; // This should include the URL to redirect the user for Khalti payment
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};
