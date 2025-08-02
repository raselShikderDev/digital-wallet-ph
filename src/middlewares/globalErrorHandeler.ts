/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import mongoose from "mongoose";
import { ZodError } from "zod";
import myAppError from "../errorHelper/myAppError";

export interface TErrorSource {
  path: string;
  message: string;
}

interface TResponse {
  statusCode: number;
  message: string;
  errorsSource: TErrorSource[];
}

// Handle invalid MongoDB ObjectId
const handleCastError = (err: mongoose.CastError): { statusCode: number; message: string } => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectId. Provide a valid ID.",
  };
};

// Handle Mongoose validation error
const handleValidationError = (err: any): TResponse => {
  const errorsSource: TErrorSource[] = [];

  const errors = Object.values(err.errors);
  errors.forEach((errorObject: any) => {
    errorsSource.push({
      path: errorObject.path,
      message: errorObject.message,
    });
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorsSource,
  };
};

// Handle duplicate key error
const handleDuplicateError = (err: any): TResponse => {
  const errorsSource: TErrorSource[] = [];
  const matchedArray = err.message.match(/"([^"]*)"/);
  const message = matchedArray ? `${matchedArray[1]} already exists` : "Duplicate key error";

  return {
    statusCode: 400,
    message,
    errorsSource,
  };
};

// Handle Zod validation error
const handleZodError = (err: ZodError): TResponse => {
  const errorsSource: TErrorSource[] = [];

  err.issues.forEach((issue) => {
    errorsSource.push({
      path: `${issue.path.join(".")}`,
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Validation Error",
    errorsSource,
  };
};


// Handling global error function
export const globalError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong: ${err.message}`;
  let errorsSource: TErrorSource[] = [];


  // Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Duplicate key error (code 11000)
  else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorsSource = simplifiedError.errorsSource;
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorsSource = simplifiedError.errorsSource;
  }
  // Zod schema validation error
  else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorsSource = simplifiedError.errorsSource;
  }
  // Custom app-defined error
  else if (err instanceof myAppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Generic JS error
  else if (err instanceof Error) {
    statusCode = 501;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorsSource,
    err: envVars.NODE_ENV === "Development" ? err.stack : null,
    stack: envVars.NODE_ENV === "Development" ? err.stack : null,
  });
};
