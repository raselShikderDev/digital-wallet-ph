import { JwtPayload } from "jsonwebtoken";
import { ITransaction } from "../transaction/transaction.interface";
import { userModel } from "../users/user.model";
import { transactionModel } from "../transaction/transaction.model";
import myAppError from "../../errorHelper/myAppError";
import { StatusCodes } from "http-status-codes";
import { walletModel } from "./wallet.model";
import { WALLET_STATUS } from "./wallet.interface";
import { envVars } from "../../config/env";

type RequiredTransactionInput = Pick<
  ITransaction,
  "amount" | "type" | "toWallet"
>;


const allWallet = async ()=>{
  const wallets = await walletModel.find()
  if (!wallets || wallets === null) {
      if (envVars.NODE_ENV === "Development") {
        // eslint-disable-next-line no-console
        console.log("Neither user nor agent created yet");
      }
    }
    const walletsCount = await walletModel.countDocuments();
    return {
      meta: walletsCount,
      data: wallets,
    };
}

// User Sending money to another user - Send money
const userSendMOney = async (
  payload: RequiredTransactionInput,
  decodedToken: JwtPayload
) => {
  const session = await transactionModel.startSession();
  session.startTransaction();
  try {
    const { amount, type, toWallet } = payload;

    // Sender wallet user
    const fromWalletUser = await userModel
      .findById(decodedToken.id, "-password")
      .populate("walletId");
    if (!fromWalletUser) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        "Sender user does not valid"
      );
    }

    // Receiver wallet user
    const receiverWallet = await walletModel
      .findById(toWallet, "-password")
      .populate("user", "-password");
    if (!receiverWallet) {
      throw new myAppError(StatusCodes.NOT_FOUND, "Receiver does not exists");
    }

    if (receiverWallet.walletStatus === WALLET_STATUS.BLOCKED) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        `Receiver user are not allowed to make transaction`
      );
    }

    // Sender wallet
    const senderWallet = await walletModel.findById(fromWalletUser.walletId);
    if (!senderWallet) {
      throw new myAppError(
        StatusCodes.NOT_FOUND,
        "Sender wallet does not exists"
      );
    }
    if (senderWallet.walletStatus === WALLET_STATUS.BLOCKED) {
      throw new myAppError(
        StatusCodes.BAD_REQUEST,
        `You are not allowed to make transaction`
      );
    }

    // Updating sender wallet balance by static hook
    const updatedSenderWallet = await walletModel.balanceAvailablity(
      amount,
      senderWallet._id,
      session
    );
    if (!updatedSenderWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating sender balance is failed"
      );
    }

   

    // Updating Receiver balance
    const updateReceiverWallet = await walletModel.findOneAndUpdate(
      {
        _id: toWallet,
        walletStatus: WALLET_STATUS.ACTIVE,
      },
      { $inc: { balance: +amount } },
      { runValidators: true, new: true, session }
    );

    if (!updateReceiverWallet) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Updating receiver balance is failed"
      );
    }


     // Creating transaction History 
    const senderPayload: ITransaction = {
      user: decodedToken.id,
      amount,
      type: type,
      initiatedBy: decodedToken.role,
      fromWallet: updatedSenderWallet._id!,
      toWallet: updateReceiverWallet._id!,
    };

    const tansactionHistory = await transactionModel.create([senderPayload], {session});
    if (!tansactionHistory) {
      throw new myAppError(
        StatusCodes.BAD_GATEWAY,
        "Creatinging transaction history is failed"
      );
    }

    await session.commitTransaction();
    return tansactionHistory;
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const walletServices = {
  userSendMOney,
  allWallet,
};
