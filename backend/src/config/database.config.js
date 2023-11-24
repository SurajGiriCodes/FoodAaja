import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { sample_users } from "../data.js";
import { sample_restaurants } from "../data.js";
import { RestaurantModel } from "../models/restrurent.model.js";
import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";

const PASSWORD_HASH_SALT_ROUNDS = 10;

set("strictQuery", true);

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    await seedUsers();
    // await seedFoods();
    // await seedRestaurants();

    console.log("connect successfilly---");
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments(); //counts the number of documents (users) in a database
  if (usersCount > 0) {
    console.log("Users seed is already done!");
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user); //create a new user document in the database,
  }

  console.log("Users seed is done!");
}

// async function seedRestaurants() {
//   const restaurantCount = await RestaurantModel.countDocuments();
//   if (restaurantCount > 0) {
//     console.log("Restaurant seed is already done!");
//     return;
//   }
//   for (const restaurant of sample_restaurants) {
//     restaurant.imageUrl = `/images/${restaurant.imageUrl}`;
//     await RestaurantModel.create(restaurant);
//   }

//   console.log("Restaurant seed is done!");
// }
