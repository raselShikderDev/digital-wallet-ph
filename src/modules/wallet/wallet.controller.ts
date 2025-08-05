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
const walletStatusToggle = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid");
    }

    const walletData = await walletServices.walletStatusToggle(id);
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
      message: "Successfully Send Money by user to user",
      data: sendMoneyData,
    });
  }
);

// User withdraw money by CASH_OUT to agent and agent receiving as CASH_OUT (but for agnet it receiving cash)
const userCashOut = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const sendMoneyData = await walletServices.userCashOut(
      payload,
      decodedToken
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully Cash Out by user to agent",
      data: sendMoneyData,
    });
  }
);

// Agent top up to user by CASH_IN and user also reciveign as CASH_IN (but actually for agent sending the money)
const agentCashIn = asyncHandle(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user;
    const cashInData = await walletServices.agentCashIn(
      payload,
      decodedToken
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully Cash In by Agent to user",
      data: cashInData,
    });
  }
);




export const walletController = {
  userSendMOney,
  allWallet,
  singelWallet,
  walletStatusToggle,
  userCashOut,
  agentCashIn,
};
