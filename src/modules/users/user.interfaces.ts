import { Types } from "mongoose";

export enum USER_STATUS{
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    DEACTIVE = "DEACTIVE",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED",
}

export enum CURRENCY{
    BDT = "BDT",
    USD = "USD",
    EUR = "EUR",
}

export enum ROLE {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    AGENT = "AGENT",
}

export interface IAuthProvider{
    provider: "google" | "Credentials"; 
    providerId:string;
}

export interface IUser {
    _id?:Types.ObjectId
    name:string;
    phone?:string;
    email:string;
    password:string;
    address?:string;
    picture?:string;
    role:ROLE;
    auths:IAuthProvider[],
    balance?:number;
    currency?:CURRENCY,
    transaction?:string[]
    status?:USER_STATUS,
    isVerified?:boolean;
    isDeleted?:boolean,
}