import { IUser } from "./user.interfaces"
import { userModel } from "./user.model"


// Create user 
const createUser = async(payload:IUser)=>{
    const {password, email, name} = payload
    const existingUser = await userModel.findOne({email})
    if (!existingUser) {
        
    }
    return
}



export const userServices ={
    createUser,
}