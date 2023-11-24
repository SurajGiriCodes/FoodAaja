import { model, Schema } from "mongoose";

export const FoodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  menuImage: { type: String, required: true },
  tags: [{ type: String, required: true }],
  details: { type: String, required: true },
});

export const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    restaurantImage: { type: String, required: true },
    stars: { type: Number, default: 3 },
    menu: [FoodSchema],
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
