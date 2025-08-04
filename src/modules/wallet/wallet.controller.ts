/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { walletServices } from "./wallet.services";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { asyncHandle } from "../../utils/asyncHandeler";
import myAppError from "../../errorHelper/myAppError";
import mongoose from "mongoose";

// Get all wallet - Only admin and super admins are allowed
const allWallet = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const walletsData = await walletServices.allWallet();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived all wallets",
      data: walletsData.data,
      meta: {
        total: walletsData.meta,
      },
    });
  }
);

// Get singel wallet by id - Only admin and super admins are allowed
const singelWallet = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const walletData = await walletServices.singelWallet(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived wallet",
      data: walletData,
    });
  }
);

// Update wallet status Block/Active by id - only admins are allowed
const eWalletStatusToggle = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    
    const walletData = await walletServices.eWalletStatusToggle(id);
    if (!walletData) {
        throw new myAppError(
          StatusCodes.BAD_REQUEST,
          "Failed to update wallet status"
        );
      }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Wallet status chnaged to ${walletData.walletStatus}`,
      data: walletData,
    });
  }
);

// User Sending money to another user - Send money
const userSendMOney = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const sendMoneyData = await walletServices.userSendMOney(
      payload,
      decodedToken
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Send money request is successfull",
      data: sendMoneyData,
    });
  }
);

export const walletController = {
  userSendMOney,
  allWallet,
  singelWallet,
  eWalletStatusToggle,
};
