import { Router } from "express";
import { userRouter } from "../modules/users/user.route";
import { authRoute } from "../modules/auth/auth.route";
import { walletRoute } from "../modules/wallet/wallet.route";


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
    {
        path:"/wallet",
        route:walletRoute,
    },
];


moduleRoute.forEach((route)=>{
    router.use(route.path, route.route)
})