import { Document } from "mongoose";

export default interface MessagingInterface extends Document {
  name: string;
  sid: string;
  authToken: string;
  user: any;
}
