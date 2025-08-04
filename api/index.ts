/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';
import { createServer, IncomingMessage, ServerResponse } from 'http';

let server: ReturnType<typeof createServer> | null = null;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = createServer((req: IncomingMessage, res: ServerResponse) => {
      app(req as any, res as any);
    });
  }
  server.emit('request', req, res);
}