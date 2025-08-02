/* eslint-disable no-console */
import { envVars } from "../config/env";
import bcrypt from "bcrypt";
import { IAuthProvider, IUser, ROLE } from "../modules/users/user.interfaces";
import { userModel } from "../modules/users/user.model";
import myAppError from "../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";

// Create Super Admin
const createSuperAdmin = async () => {
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

    await userModel.create(superAdmin);

    if (envVars.NODE_ENV === "Development") {
      console.log("Super admin created");
    }
  } catch (error) {
    if (envVars.NODE_ENV === "Development") {
      console.log(`Faild to create default super admin: ${error}`);
    }
    throw new myAppError(
      StatusCodes.BAD_GATEWAY,
      "Creating super admin is faild"
    );
  }
};

export default createSuperAdmin;
