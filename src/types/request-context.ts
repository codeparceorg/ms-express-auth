import { Request } from 'express';

export interface RequestContext {
  requestId: string;
}

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `req_${timestamp}${random}`;
}
