import { Router } from "express";
import { authController } from "./auth.controller";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "../users/user.interfaces";
import requestValidator from "../../middlewares/requestValidator";
import { resetPasswordZod } from "./authZodvalidation";


const route = Router()

// Login with credentials
route.post("/login", authController.credentialLogin)
// generate new access token by refresh token
route.post("/refresh-token", authController.getNewAccessToken)
// Reset user password
route.post("/reset-password", requestValidator(resetPasswordZod), authCheck(...Object.values(ROLE)), authController.resetPassword)
// logout user
route.post("/logout", authController.logOutUser)


export const authRoute = route