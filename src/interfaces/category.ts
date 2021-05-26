import { Document } from "mongoose";

export default interface CategoryInterface extends Document {
  name: string;
}
