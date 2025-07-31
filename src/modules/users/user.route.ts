import { Router } from "express";
import { userController } from "./user.controller";


const router = Router()


router.post("/register", userController.createuser)
router.get("/", userController.allUser)
router.get("/:id", userController.getUser)
router.get("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)


export const userRouter = router