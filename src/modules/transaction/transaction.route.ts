import { Router } from "express";
import { transactionController } from "./transaction.controller";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "../users/user.interfaces";

const router = Router()


// View all transactin of loggedIn user
router.get("/", authCheck(...Object.values(ROLE)), transactionController.viewTransactionsHistory)
// View all transactin occoured till now - only for admin and super admin
router.get("/all", authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN), transactionController.allTransaction)
// View all transactin of an user - only for admin and super admin
router.get("/:id", authCheck(ROLE.SUPER_ADMIN, ROLE.ADMIN), transactionController.singelUserTransaction)


export const transactionRoute = router