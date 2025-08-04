import { Router } from "express";
import { walletController } from "./wallet.controller";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "../users/user.interfaces";
import requestValidator from "../../middlewares/requestValidator";
import { userSendMoneyZodSchema } from "./wallet.zodValidation";


const router = Router()

// Send money for user
router.post("/user-send-money", requestValidator(userSendMoneyZodSchema), authCheck(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN), walletController.userSendMOney)


export const walletRoute = router