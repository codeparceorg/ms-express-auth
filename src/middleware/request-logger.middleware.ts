import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { generateRequestId } from '../types/request-context';

const EXCLUDED_PATHS = ['/health', '/favicon.ico'];

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const path = req.originalUrl || req.url;
  if (EXCLUDED_PATHS.includes(path)) {
    next();
    return;
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path,
      status: res.statusCode,
      duration,
      ip: req.ip || req.socket.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      responseSize: res.getHeader('content-length') || undefined,
    };
    logger.info(logData, 'request completed');
  });

  next();
}
