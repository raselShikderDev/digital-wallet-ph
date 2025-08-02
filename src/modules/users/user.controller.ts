/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { asyncHandle } from "../../utils/asyncHandeler";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import {StatusCodes} from "http-status-codes"
import mongoose from "mongoose";
import myAppError from "../../errorHelper/myAppError";


// Creating a user
const createuser = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{
    const payload = req.body
    const newUser = await userServices.createUser(payload);

    sendResponse(res, {
    statusCode:StatusCodes.CREATED,
    success:true,
    message:"User successfully created",
    data:newUser,
    })
})

// Retriving all user
const allUser = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{    
    const data = await userServices.alluser()
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived users",
    data:data.data,
    meta:{
        total:data.meta
    },
    })
})

// Retriving user by id
const getUser = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
     const data = await userServices.getUser(id)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived user",
    data:data,
    })
})

// Updating user by id
const updateUser = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{
    
    const id = req.params.id
    const decodedToken = req.user
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    const payload = req.body
    const data = await userServices.updateUser(id, payload, decodedToken)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully updated user",
    data:data,
    })
})

// Deleteing user by id
const deleteUser = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    await userServices.deleteUser(id)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully deleted user",
    data:null,
    })
})


export const userController = {
    createuser,
    allUser,
    getUser,
    deleteUser,
    updateUser,
}