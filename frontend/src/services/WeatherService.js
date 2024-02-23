import axios from "axios";

const getWeather = async (latitude, longitude) => {
  console.log("Fetching weather for:", latitude, longitude);

  try {
    const response = await axios.get(
      `http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`
    );
    return response.data; // The weather data from your backend
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // You can handle this error as needed
  }
};

export default getWeather;
