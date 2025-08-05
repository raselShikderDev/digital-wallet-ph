import { Router } from "express";
import { walletController } from "./wallet.controller";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "../users/user.interfaces";
import requestValidator from "../../middlewares/requestValidator";
import {
  userTransactionZodSchema,
} from "./wallet.zodValidation";

const router = Router();

// Send money for user
router.post(
  "/user-send-money",
  requestValidator(userTransactionZodSchema),
  authCheck(ROLE.USER),
  walletController.userSendMOney
);

// User withdraw money by CASH_OUT to agent and agent receiving as CASH_OUT (but for agnet it receiving cash)
router.post(
  "/user-cash-out",
  requestValidator(userTransactionZodSchema),
  authCheck(ROLE.USER),
  walletController.userCashOut
);

// Agent top up to user by CASH_IN and user also reciveign as CASH_IN (but actually for agent sending the money)
router.post(
  "/agent-cash-in",
  requestValidator(userTransactionZodSchema),
  authCheck(ROLE.AGENT),
  walletController.agentCashIn
);
// all wallet - only for admins and super admins
router.get(
  "/all",
  authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.allWallet
);
// Update wallet status Block/Active by id - only for admins and super admins
router.patch(
  "/status/:id",
  authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.walletStatusToggle
);
// get wallet by id - only for admins and super admins
router.get(
  "/:id",
  authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  walletController.singelWallet
);

export const walletRoute = router;
