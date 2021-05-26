import mongoose, { Schema } from "mongoose";

import UserInterface from "../interfaces/user";

const MODEL_NAME = "User";
const REF_MODULE_NAME = "Messaging";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    messaging: {
      items: [
        {
          messagingId: { type: Schema.Types.ObjectId, ref: REF_MODULE_NAME, required: true },
        },
      ],
    },
    allowedMessagingTypes: {
      type: Array,
      default: [],
    },
    allowedMessagingActions: {
      type: Array,
      default: [],
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.addToMessaging = function (this: any, messaging: any) {
  const updatedCartItems = [...this.messaging.items];

  updatedCartItems.push({ messagingId: messaging._id });

  const updatedCart = { items: updatedCartItems };
  this.messaging = updatedCart;
  return this.save();
};

export default mongoose.model<UserInterface>(MODEL_NAME, UserSchema);
