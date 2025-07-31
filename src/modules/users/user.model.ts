import mongoose, { Schema } from "mongoose";
import {
  CURRENCY,
  IUser,
  ROLE,
  USER_STATUS,
  IAuthProvider,
} from "./user.interfaces";

const authProviderSchema = new mongoose.Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new mongoose.Schema<IUser>(
  {
    _id: Schema.ObjectId,
    name: {
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
    auths: { type: [authProviderSchema] },
    balance: { type: Number, default: 50 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const userModel = mongoose.model<IUser>("users", userSchema);
