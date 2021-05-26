import { Document } from "mongoose";

export default interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  about: any;
  role: number;
  messaging: any;
}
