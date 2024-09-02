import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import orderRouter from "./routers/order.router.js";
import WeatherRouter from "./routers/Weather.route.js";
import { dbconnect } from "./config/database.config.js";
import path, { dirname } from "path";
dbconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); //create an Express application
app.use(
  cors({
    credentials: true, //server allows credentials like authentication info
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json({ limit: "50mb" })); //can adjust the payload size limit by configuring the body-parser middleware.

app.use("/api/restaurants", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api", WeatherRouter);

const publicFolder = path.join(__dirname, "public");
app.use(express.static(publicFolder));

app.get("*", (req, res) => {
  const indexFilePath = path.join(publicFolder, "index.htm");
  res.sendFile(indexFilePath);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
