/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";
import myAppError from "../../errorHelper/myAppError";
import { IAuthProvider, IUser, ROLE } from "./user.interfaces";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";

// Create user
const createUser = async (payload: IUser) => {
  const { password, email, ...rest } = payload;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hasedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND as string)
  );

  const authProvider: IAuthProvider = {
    provider: "Credentials",
    providerId: email,
  };

  const newUser = await userModel.create({
    ...rest,
    email,
    auths: [authProvider],
    password: hasedPassword,
  });

  if (!newUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "User creation faild");
  }

  return newUser;
};

// get all user
const alluser = async () => {
  const users = await userModel.find();
  if (!users || users === null) {
    if (envVars.NODE_ENV === "Development") {
      console.log("user not created yet");
    }
  }
  const userCount = await userModel.countDocuments();
  return {
    meta: userCount,
    data: users,
  };
};

// get user by id
const getUser = async (id: string) => {
  const user = await userModel.findById(id);
  if (!user || user === null) {
    if (envVars.NODE_ENV === "Development") {
      console.log("User not created yet");
    }
    throw new myAppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  return user;
};

// update user by id
const updateUser = async (id: string, payload:Partial<IUser>, decodedToken:JwtPayload) => {

  if (payload.role) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.AGENT) {
      throw new myAppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
    
    if (payload.role === ROLE.SUPER_ADMIN || decodedToken.role === ROLE.ADMIN) {
      throw new myAppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }


  if(payload.isDeleted || payload.isVerified || payload.role || payload.status || payload.isAgentApproved){
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.AGENT) {
      throw new myAppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

if (payload.password) {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(envVars.BCRYPT_SALT_ROUND as string)
  );
}


const updatedNewUser = await userModel.findByIdAndUpdate(id, payload, {new:true, runValidators:true})

if (!updatedNewUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "User update faild");
  }
  return updatedNewUser
};

// delete user by id
const deleteUser = async (id: string) => {
  const deletedUser = await userModel.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User not found");
  }
  return true;
};

export const userServices = {
  createUser,
  alluser,
  getUser,
  deleteUser,
  updateUser,
};
