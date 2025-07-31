import { Response } from "express";

interface IMeta{
    total:number
}

interface IResponse<T>{
    statusCode:number,
    message:string,
    success:boolean,
    data:T,
    meta?:IMeta,
}



const sendResponse = <T>(res:Response, data:IResponse<T>)=>{
    res.send(data.statusCode).json({
    statusCode:data.statusCode,
    message:data.message,
    success:data.success,
    data:data.data,
    meta:data.meta,
    })
}


export default sendResponse