/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


const notFound = async (req:Request, res:Response, next:NextFunction)=>{
    res.status(StatusCodes.NOT_FOUND).json({
        success:false,
        message:"Route not found"
    })
}

export default notFound