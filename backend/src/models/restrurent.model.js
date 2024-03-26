import { model, Schema } from "mongoose";
import { FoodModel } from "./food.model.js";

export const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 3.5 },
    restaurantImageUrl: { type: String, required: true },
    menu: [FoodModel.schema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const RestaurantModel = model("restaurant", RestaurantSchema);
