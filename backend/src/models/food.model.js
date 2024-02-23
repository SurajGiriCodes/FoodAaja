import { model, Schema } from "mongoose";

const FoodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  menuImageUrl: { type: String, required: true },
  tags: [{ type: String, required: true }],
  details: { type: String, required: true },
  category: { type: String, required: true },
});

export const FoodModel = model("food", FoodSchema);
