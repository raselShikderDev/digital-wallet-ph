/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import myAppError from "../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";
import { verifyJwtToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { userModel } from "../modules/users/user.model";
import { USER_STATUS } from "../modules/users/user.interfaces";

const authCheck =
  (...authRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "Development") {
      console.log("started checking user role uthentication");
    }
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new myAppError(StatusCodes.NOT_FOUND, "User token is not found")
      }

      const verifyToken = await verifyJwtToken(token, envVars.JWT_ACCESS_SECRET as string) as JwtPayload
      if (!verifyToken) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User token is not valid")
      }

      const existingUser = await userModel.findOne({email:verifyToken.email})

      if (!existingUser) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User not found")
      }

      if (existingUser.isDeleted === true) {
         throw new myAppError(StatusCodes.BAD_REQUEST, "user already deleted")
      }

      if (existingUser.status === USER_STATUS.DEACTIVE || existingUser.status === USER_STATUS.BLOCKED || existingUser.status === USER_STATUS.SUSPENDED) {
        throw new myAppError(StatusCodes.BAD_REQUEST, `${existingUser.status}`)
      }

      req.user = verifyToken as JwtPayload

      if (!authRole.includes(verifyToken.role)) {
        if (envVars.NODE_ENV === "Development") {
      console.log(`${verifyToken.role} is not allowed`);
    }
         throw new myAppError(StatusCodes.UNAUTHORIZED, `You are not authorized`)
      }
      next()
    } catch (error) {
      next(error)
    }
  };

export default authCheck