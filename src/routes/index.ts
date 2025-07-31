import { Router } from "express";
import { userRouter } from "../modules/users/user.route";
import { authRoute } from "../modules/auth/auth.route";


export const router = Router()

const moduleRoute = [
    {
        path:"/user",
        route:userRouter,
    },
    {
        path:"/auth",
        route:authRoute,
    },
];


moduleRoute.forEach((route)=>{
    router.use(route.path, route.route)
})