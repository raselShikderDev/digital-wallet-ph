import { IUser, USER_STATUS } from "../users/user.interfaces";
import { userModel } from "../users/user.model";
import myAppError from "../../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createUserToken } from "../../utils/createuserToken";
import { verifyJwtToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Login with credentials
const credentialLogin = async (payload: IUser) => {
  const { email, password } = payload;

  const isUserExist = await userModel.findOne({ email });
  if (!isUserExist) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist.password
  );
  if (!isPasswordMatched) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "Invalid password");
  }

  const userTokens = await createUserToken(isUserExist);
  if (!userTokens) {
    throw new myAppError(StatusCodes.BAD_GATEWAY, "Creating token is faild");
  }
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  };
};

// Creating new accesss token by refresh tken
const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = (await verifyJwtToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET as string
  )) as JwtPayload;

  if (!verifiedRefreshToken) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "RefreshToken is not valid");
  }

  const existingUser = await userModel.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!existingUser) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "User not found");
  }

  if (existingUser.isDeleted === true) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "user already deleted");
  }

  if (
    existingUser.status === USER_STATUS.DEACTIVE ||
    existingUser.status === USER_STATUS.BLOCKED ||
    existingUser.status === USER_STATUS.SUSPENDED
  ) {
    throw new myAppError(StatusCodes.BAD_REQUEST, `${existingUser.status}`);
  }

  const newAccessToken = await createUserToken(existingUser)
  return newAccessToken
};

// Resetting user password
const resetPassword = async(oldpassword:string, newPassword:string, currentUser:JwtPayload)=>{
  const user = await userModel.findById(currentUser.id)
  if (!user) {
    throw new myAppError(StatusCodes.NOT_FOUND, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(oldpassword, user.password);
  if (!isPasswordMatched) {
    throw new myAppError(StatusCodes.BAD_REQUEST, "Invalid password");
  }

  user.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND as string)) 
  user.save()
}

export const authServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
