import express, { Application, Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { router } from "./routes"
import notFound from "./middlewares/notFound"
import { globalError } from "./middlewares/globalErrorHandeler"
import path from "path"

const app:Application = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../public')));

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use(globalError)


app.use(notFound)

export default app