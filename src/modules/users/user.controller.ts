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

// get all user and agent combined
const allUserAndAgents = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{    
    const data = await userServices.alluser()
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived all users and agents",
    data:data.data,
    meta:{
        total:data.meta
    },
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


// Retriving all Agents
const allAgents = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{    
    const data = await userServices.allAgents()
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived all agents",
    data:data.data,
    meta:{
        total:data.meta
    },
    })
})

// Retriving an singel Agent by id
const getSingelAgent = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{ 
    const id = req.params.id   
    const data = await userServices.getSingelAgent(id)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived agent",
    data:data,
    })
})


// Updating user role to agent by id - only allowed for admins
const agentApproval = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    const data = await userServices.agentApproval(id)
    
    if (data.updatedToAgent || data.updatedToAgent === null) {
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update user to agent"
    );
  }
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:data.message,
    data:data.alreadyApproved,
    })
})


// update agent status in a toggle system by id - only admins are allowed
const agentStatusToggle = asyncHandle(async(req:Request, res:Response, next:NextFunction)=>{

    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    const data = await userServices.agentStatusToggle(id)
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:`Agent successfully ${data.isAgentApproved ? "Approved" : "Suspended"}`,
    data:data,
    })
})


export const userController = {
    createuser,
    allUserAndAgents,
    allUser,
    getUser,
    deleteUser,
    updateUser,
    allAgents,
    getSingelAgent,
    agentApproval,
    agentStatusToggle,
}