/* eslint-disable no-console */
import { envVars } from "../config/env";
import bcrypt from "bcrypt";
import { IAuthProvider, IUser, ROLE } from "../modules/users/user.interfaces";
import { userModel } from "../modules/users/user.model";
import myAppError from "../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";
import { walletModel } from "../modules/wallet/wallet.model";
import { WALLET_CURRENCY } from "../modules/wallet/wallet.interface";

// Create Super Admin
const createSuperAdmin = async () => {
  const session = await walletModel.startSession();
  session.startTransaction();
  try {
    const email: string = envVars.SUPER_ADMIN_EMAIL as string;
    const password: string = envVars.SUPER_ADMIN_PASSWORD as string;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (envVars.NODE_ENV === "Development") {
        console.log("Super admmin already exists");
      }
      return;
    }

    if (envVars.NODE_ENV === "Development") {
      console.log("Starting the creation of Super admmin");
    }

    const hasedPassword = await bcrypt.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND as string)
    );

    const authProvider: IAuthProvider = {
      provider: "Credentials",
      providerId: email,
    };

    const superAdmin: Partial<IUser> = {
      name: "Super Admin",
      email,
      password: hasedPassword,
      role: ROLE.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const supderAdmin = await userModel.create([superAdmin], { session });
    if (!supderAdmin) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Creating super admin is faild"
      );
    }

    if (envVars.NODE_ENV === "Development") {
      console.log("Super admin created");
    }

    const wallet = await walletModel.create(
      [
        {
          user: supderAdmin[0]._id,
          balance: 500000,
          limit: 5,
          currency: WALLET_CURRENCY.BDT,
        },
      ],
      { session }
    );

    if (!wallet) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to create wallet");
    }

    const supderAdminWallet = await userModel.findByIdAndUpdate(
      wallet[0].user,
      { walletId: wallet[0]._id },
      { runValidators: true, new: true, session }
    );

    if (!supderAdminWallet) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Failed to create super admin's wallet");
    }

    await session.commitTransaction();
  } catch (error) {
    if (envVars.NODE_ENV === "Development") {
      console.log(`Faild to create default super admin: ${error}`);
    }
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default createSuperAdmin;
