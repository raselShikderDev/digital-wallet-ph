import { Router } from "express";
import { userController } from "./user.controller";
import requestValidator from "../../middlewares/requestValidator";
import { createUserZodValidator, updateUserZodValidator } from "./user.zodvalidator";
import authCheck from "../../middlewares/authCheck";
import { ROLE } from "./user.interfaces";


const router = Router()


// get all user and agent combined - (Only admins and super admins are allowed)
router.get("/", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allUserAndAgents)
// Register user
router.post("/register", requestValidator(createUserZodValidator), userController.createuser)
// Get all user - (Only admins and super admins are allowed)
router.get("/all-users", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allUser)
// Get all Agents - (Only admins and super admins are allowed)
router.get("/all-agents", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allAgents)
// Get singel Agent by id - (Only admins and super admins are allowed)
router.get("/agents/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getSingelAgent)
// Get singel user id - (Only admins and super admins are allowed)
router.get("/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getUser)

// update user by id
router.patch("/:id", authCheck(...Object.values(ROLE)), requestValidator(updateUserZodValidator), userController.updateUser)
// update user role to agent by id - (Only admins and super admins are allowed)
router.patch("/agent-approve/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentApproval)
// update agent status to in a toggle system by id - (Only admins and super admins are allowed)
router.patch("/agent-status/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentStatusToggle)
// Delete user by id - (Only admins and super admins are allowed)
router.delete("/:id", authCheck(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.deleteUser)


export const userRouter = router