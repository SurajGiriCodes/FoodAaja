import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import bodyParser from "body-parser";
import multer from 'multer'

import { dbconnect } from "./config/database.config.js";
dbconnect();

const app = express(); //create an Express application
app.use(express.json()); //telling the express app to use json

//it allow requests from a specific origin here (http://loaclhost:3000)
//method that allow to add middleware functions to our application's.
app.use(
  //it's a function or middleware provided by the "cors" package
  //configuring the CORS (Cross-Origin Resource Sharing) middleware. This middleware defines how your server should handle requests from different origins (domains).
  cors({
    credentials: true, //server allows credentials like authentication info
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json({ limit: "50mb" }));//can adjust the payload size limit by configuring the body-parser middleware.

app.use("/api/restaurants", foodRouter);
app.use("/api/users", userRouter);


const PORT = 5000;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
