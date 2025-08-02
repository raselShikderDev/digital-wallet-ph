/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

type asyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandle =
  (fn: asyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (envVars.NODE_ENV === "Development") {
        console.log(err);
      }
      next(err)
    });
  };
