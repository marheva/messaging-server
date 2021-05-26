import mongoose, { Schema } from "mongoose";

import CategoryInterface from "../interfaces/category";

const MODEL_NAME = "Category";

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<CategoryInterface>(MODEL_NAME, CategorySchema);
