/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { walletServices } from "./wallet.servicess"
import { StatusCodes } from "http-status-codes"
import sendResponse from "../../utils/sendResponse"


const userSendMOney = async (req:Request, res:Response, next:NextFunction)=>{
    const payload = req.body
    const decodedToken = req.user
    const sendMoneyData = await walletServices.userSendMOney(payload, decodedToken)
    // eslint-disable-next-line no-console
    console.log("sendMoneyData: ", sendMoneyData)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully updated user",
    data:sendMoneyData,
    })
}


export const walletController = {
    userSendMOney
}