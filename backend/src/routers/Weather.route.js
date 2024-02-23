import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

//Add an endpoint in your backend to fetch weather data
router.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    res.json(weatherResponse.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      res.status(error.response.status).json({
        message: "Error from OpenWeather API",
        error: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
      res.status(500).json({
        message: "No response received from OpenWeather API",
        error: error.message,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      res.status(500).json({
        message: "Error setting up request to OpenWeather API",
        error: error.message,
      });
    }
  }
});

export default router;
