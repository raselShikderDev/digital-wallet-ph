/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken"
import { ITransaction } from "../transaction/transaction.interface"
import { userModel } from "../users/user.model"
import { transactionModel } from "../transaction/transaction.model"
import myAppError from "../../errorHelper/myAppError"
import { StatusCodes } from "http-status-codes"
import { walletModel } from "./wallet.model"
import { WALLET_STATUS } from "./wallet.interface"
import { STATUS_CODES } from "http"

type RequiredTransactionInput = Pick<ITransaction, 'amount' | 'type' | 'toWallet'>;

// User Sending money to another user - Send money
const userSendMOney = async (payload:RequiredTransactionInput, decodedToken:JwtPayload)=>{
    const session = await transactionModel.startSession()
    session.startTransaction()
   try {
    const {amount, type, toWallet,} = payload
    // eslint-disable-next-line no-console
    console.log(`payload: ${amount} ${toWallet}, ${type}`);
    const {id, email, role} = decodedToken

    const fromWalletUser = await userModel.findById(decodedToken.id, "-password").populate("walletId")
    if (!fromWalletUser) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "Sender user does not valid")
    }

   const toWalletUser = await walletModel.findById(toWallet, "-password").populate("user", "-password")
    if (!toWalletUser) {
        throw new myAppError(StatusCodes.NOT_FOUND, "Receiver does not exists")
    }

   const senderWallet = await walletModel.findById(fromWalletUser.walletId)
   if (!senderWallet) {
        throw new myAppError(StatusCodes.NOT_FOUND, "Sender wallet does not exists")
    }
   if(senderWallet.walletStatus === WALLET_STATUS.BLOCKED){
     throw new myAppError(StatusCodes.BAD_REQUEST, `You are not allowed to make ${type}`)
   }
   if(amount > senderWallet.balance!){
     throw new myAppError(StatusCodes.BAD_REQUEST, `Insufficient balance`)
   }

    
    await session.commitTransaction()
    return {
        fromWalletUser,
        toWalletUser
    }
   } catch (error) {
    session.abortTransaction()
    throw error
   } finally{
    session.endSession()
   }
    
}


export const walletServices = {
    userSendMOney
}