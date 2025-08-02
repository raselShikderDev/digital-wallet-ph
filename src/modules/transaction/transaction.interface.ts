import { Types } from "mongoose"

/**
 * 1. While user send to other user it's a SEND_MONEY for who sender, for receiver it's a RECEIVED_MONEY
 * 2. When user will take money from bank or card it will be a ADD_MONEY for user
 * 3. While user send to Agent for withdraw it's an CASH_OUT for user, and it will be count as RECEIVED_MONEY for Agent
 * 4. While Agent will deposit money to a User its an CASH_IN for both parties
 */

export enum TransactionInitiatedBy {
    USER = "USER",
    AGENT = "AGENT",
}

export enum TransactionType {
    SEND_MONEY = "SEND_MONEY",
    ADD_MONEY = "ADD_MONEY",
    RECEIVED_MONEY = "RECEIVED_MONEY",
    CASH_OUT = "CASH_OUT",
    CASH_IN = "CASH_IN",
}

export interface ITransaction {
    _id?:Types.ObjectId,
    user:Types.ObjectId,
    amount:number,
    type:TransactionType,
    initiatedBy:TransactionInitiatedBy ,
    fromWallet:Types.ObjectId,
    toWallet:Types.ObjectId,
}