import { Router } from "express";
import { walletController } from "./wallet.controller";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "../users/user.interfaces";
import requestValidator from "../../middlewares/requestValidator";
import { userSendMoneyZodSchema } from "./wallet.zodValidation";


const router = Router()

// Send money for user
router.post("/user-send-money", requestValidator(userSendMoneyZodSchema), authCheck(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN), walletController.userSendMOney)
// all wallet - only for admins and super admins
router.post("/all-wallets", authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN), walletController.allWallet)
// get wallet by id - only for admins and super admins
router.post("/:id", authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN), walletController.singelWallet)
// Update wallet status Block/Active by id - only for admins and super admins
router.patch("/:id", authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN), walletController.updateWalletStatus)


export const walletRoute = router