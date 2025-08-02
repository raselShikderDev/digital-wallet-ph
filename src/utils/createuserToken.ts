import { generateAccessToken } from "./jwt"
import { IUser } from "../modules/users/user.interfaces"
import { envVars } from "../config/env"


export const createUserToken = async (user:Partial<IUser>)=>{
    const jwtPayload = {
    id:user._id,
    email:user.email,
    role:user.role,
  }
    const accessToken = await generateAccessToken(jwtPayload, envVars.JWT_ACCESS_SECRET as string, envVars.JWT_ACCESS_EXPIRES as string)


    const refreshToken = await generateAccessToken(jwtPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRES as string)

    return{
        accessToken,
        refreshToken
    }
}