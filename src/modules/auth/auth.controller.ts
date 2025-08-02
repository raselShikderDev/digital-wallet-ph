/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { asyncHandle } from "../../utils/asyncHandeler";
import { authServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookies";
import myAppError from "../../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { envVars } from "../../config/env";

// Credentials login
const credentialLogin = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userTokens = await authServices.credentialLogin(payload);
    if (!userTokens) {
      throw new myAppError(StatusCodes.BAD_GATEWAY, "Login faild");
    }

    if (envVars.NODE_ENV === "Development") {
          console.log("userTokens: ", userTokens);
        }
    
    await setAuthCookie(res, userTokens);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User successfully logged in",
      data: userTokens,
    });
  }
);


// Credentials login
const resetPassword = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const {oldpassword, newPassword} = req.body;
    const currentUser =  req.user

    await authServices.resetPassword(oldpassword, newPassword, currentUser);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User password successfully reset",
      data: null,
    });
  }
);

// creating accessToken by usinng refreshToken 
const getNewAccessToken = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) =>{
    const refreshToken = req.cookies.refreshToken
    const newAccessToken = await authServices.getNewAccessToken(refreshToken as string);

    await setAuthCookie(res, newAccessToken)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New accessToken successfully generated",
      data: newAccessToken.accessToken,
    });
})

// Logout user 
const logOutUser = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) =>{
    res.clearCookie("accessToken", {
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    })
    res.clearCookie("refreshToken", {
      httpOnly:true,
      secure:false,
      sameSite:"lax"
    })

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User successfully logout",
      data: null,
    });
})

export const authController = {
  credentialLogin,
  logOutUser,
  getNewAccessToken,
  resetPassword,
};
