import mongoose, { Schema } from "mongoose";

import UploadedContactInterface from "../interfaces/uploadedContact";

const MODEL_NAME = "UploadedContact";
const REF_MODULE_NAME = "Category";

const UploadedContactSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    company_name: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    phone_1: {
      type: String,
    },
    email: {
      type: String,
    },
    email_1: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: REF_MODULE_NAME,
    },
    customerId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UploadedContactInterface>(MODEL_NAME, UploadedContactSchema);
