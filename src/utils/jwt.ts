import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

// Genereating user's access token
export const generateAccessToken = async (payload:JwtPayload, secret:string, expires:string)=>{
    const userToken = jwt.sign(payload, secret, {expiresIn:expires} as SignOptions)
    return userToken
}


// verifying user token by jwt
export const verifyJwtToken = async (token:string, secret:string)=>{
    const decodedToken = jwt.verify(token, secret)
    return decodedToken
}