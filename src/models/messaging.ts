import mongoose, { Schema } from "mongoose";

import MessagingInterface from "../interfaces/messaging";

const MODEL_NAME = "Messaging";
const REF_MODULE_NAME = "User";

const MessagingSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sid: {
      type: String,
      trim: true,
      required: true,
    },
    authToken: {
      type: String,
      trim: true,
      required: true,
    },
    numberFrom: {
      type: String,
    },
    numberTo: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: REF_MODULE_NAME,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<MessagingInterface>(MODEL_NAME, MessagingSchema);
