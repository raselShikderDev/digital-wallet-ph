/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { walletServices } from "./wallet.servicess"
import { StatusCodes } from "http-status-codes"
import sendResponse from "../../utils/sendResponse"
import { asyncHandle } from "../../utils/asyncHandeler"


// Get all wallet - Only admin and super admins are allowed
const allWallet = asyncHandle(async (req:Request, res:Response, next:NextFunction)=>{
const walletsData = await walletServices.allWallet()
    // if (walletsData.data.length === 0) {
        
    // }
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Send money request is successfull",
    data:walletsData.data,
    meta:{
        total:walletsData.meta
    }
    })
})

// User Sending money to another user - Send money
const userSendMOney = asyncHandle(async (req:Request, res:Response, next:NextFunction)=>{
    const payload = req.body
    const decodedToken = req.user
    const sendMoneyData = await walletServices.userSendMOney(payload, decodedToken)
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Send money request is successfull",
    data:sendMoneyData,
    })
})


export const walletController = {
    userSendMOney,
    allWallet
}