import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

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
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      res.status(error.response.status).json({
        message: "Error from OpenWeather API",
        error: error.response.data,
      });
    } else if (error.request) {
      console.log(error.request);
      res.status(500).json({
        message: "No response received from OpenWeather API",
        error: error.message,
      });
    } else {
      console.log("Error", error.message);
      res.status(500).json({
        message: "Error setting up request to OpenWeather API",
        error: error.message,
      });
    }
  }
});

export default router;
