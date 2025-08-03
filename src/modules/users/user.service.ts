import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";
import myAppError from "../../errorHelper/myAppError";
import { IAuthProvider, IUser, ROLE } from "./user.interfaces";
import { userModel } from "./user.model";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { walletModel } from "../wallet/wallet.model";
import { console } from "inspector";
import { WALLET_CURRENCY } from "../wallet/wallet.interface";

// Create user
const createUser = async (payload: IUser) => {
  const session = await walletModel.startSession();
  session.startTransaction();
  try {
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

    const newUser = await userModel.create(
      [
        {
          ...rest,
          email,
          auths: [authProvider],
          password: hasedPassword,
        },
      ],
      { session }
    );

    if (!newUser[0]) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "User creation failed");
    }

    const wallet = await walletModel.create(
      [
        {
          user: newUser[0]._id,
          balance: 50,
          limit: 10,
          currency: WALLET_CURRENCY.BDT,
        },
      ],
      { session }
    );

    if (!wallet) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to create wallet");
    }

    const userIncludingWallet = await userModel.findByIdAndUpdate(
      wallet[0].user,
      { walletId: wallet[0]._id },
      { runValidators: true, new: true, session }
    );

    if (!userIncludingWallet) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to create wallet");
    }

    await session.commitTransaction();
    return userIncludingWallet;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (envVars.NODE_ENV === "Development") {
      console.log(`creating user is failed: ${error}`);
    }
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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
const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (payload.role) {
    if (decodedToken.role === ROLE.USER || decodedToken.role === ROLE.AGENT) {
      throw new myAppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === ROLE.SUPER_ADMIN || decodedToken.role === ROLE.ADMIN) {
      throw new myAppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (
    payload.isDeleted ||
    payload.isVerified ||
    payload.role ||
    payload.status ||
    payload.isAgentApproved ||
    payload.walletId
  ) {
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

  const updatedNewUser = await userModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedNewUser) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "User update faild");
  }
  return updatedNewUser;
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
