import { Document } from "mongoose";

export default interface UploadedContactInterface extends Document {
  first_name: string;
  last_name?: string;
  company_name?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
  phone: string;
  phone_1?: string;
  email?: string;
  email_1?: string;
  category: string;
  customerId?: string;
}
