import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { envVars } from "../config/env";

type AnyZodObject = ZodObject<ZodRawShape>;

const requestValidator =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;    
    await zodSchema.parseAsync(body);
    if (envVars.NODE_ENV === "Development") {
      // eslint-disable-next-line no-console
      console.log("Data of request successfully validated via Zod");
    }
    next();
  };


  export default requestValidator