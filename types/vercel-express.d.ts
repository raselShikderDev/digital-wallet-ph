/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vercel-express' {
  import { Application } from 'express';

  export function createVercelHandler(app: Application): (req: any, res: any) => void;
}