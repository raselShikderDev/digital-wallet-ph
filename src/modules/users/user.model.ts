import mongoose, { Schema } from "mongoose";
import { CURRENCY, IUser, ROLE, USER_STATUS } from "./user.interfaces";

const userSchema = new mongoose.Schema<IUser>({
  _id: Schema.ObjectId,
  name:{
   type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: Object.values(ROLE),
    default: ROLE.USER,
  },
  phone: String,
  picture: String,
  address: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  transaction: { type: [String], default: [] },
  currency: { type: String, default: CURRENCY.BDT },
  balance: { type: Number, default: 50 },
});


export const userModel = mongoose.model<IUser>("users", userSchema)