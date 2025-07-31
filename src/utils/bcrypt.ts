import bcrypt from "bcryptjs"
import {envVars} from "../config/env"

export const generatePassword = (password:string)=>{
    const hasedPassword = bcrypt.hash(password, envVars.BCRYPT_SALT_ROUND as string)
}