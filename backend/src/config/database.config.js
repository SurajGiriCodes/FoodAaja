import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";

const PASSWORD_HASH_SALT_ROUNDS = 10;

set("strictQuery", true);

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      dbName: "FoodProject",
    });
    await seedUsers();

    console.log("connect database successfilly---");
  } catch (error) {
    console.log(error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments(); //counts the number of documents (users) in a database
  if (usersCount > 0) {
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user); //create a new user document in the database,
  }

  console.log("Users seed is done!");
}
