import { Router } from "express";
import { userController } from "./user.controller";
import requestValidator from "../../middlewares/requestValidator";
import { createUserZodValidator, updateUserZodValidator } from "./user.zodvalidator";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "./user.interfaces";


const router = Router()

// Register user
router.post("/register", requestValidator(createUserZodValidator), userController.createuser)
// Get all user - (Only admins and super admins are allowed)
router.get("/", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allUser)
// Get singel user id - (Only admins and super admins are allowed)
router.get("/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getUser)
// update user by id
router.patch("/:id", authCheck(...Object.values(ROLE)), requestValidator(updateUserZodValidator), userController.updateUser)
// Delete user by id - (Only admins and super admins are allowed)
router.delete("/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.deleteUser)


export const userRouter = router