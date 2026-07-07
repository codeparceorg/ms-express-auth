import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../src/middleware/request-logger.middleware';

describe('request-logger middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      originalUrl: '/auth/login',
      url: '/auth/login',
      headers: {},
      ip: '192.168.1.1',
      socket: { remoteAddress: '192.168.1.1' } as any,
    };
    mockRes = {
      statusCode: 200,
      setHeader: jest.fn(),
      getHeader: jest.fn(),
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') {
          cb();
        }
        return mockRes as Response;
      }),
    };
    mockNext = jest.fn();
  });

  it('debe generar un requestId si no viene en headers', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.requestId).toBeDefined();
    expect(mockReq.requestId).toMatch(/^req_/);
  });

  it('debe reutilizar el requestId del header', () => {
    mockReq.headers = { 'x-request-id': 'client-req-id' };

    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.requestId).toBe('client-req-id');
  });

  it('debe setear X-Request-Id en la respuesta', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.setHeader).toHaveBeenCalledWith('X-Request-Id', expect.any(String));
  });

  it('debe llamar a next', () => {
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('debe saltar el log para /health', () => {
    mockReq.originalUrl = '/health';
    mockReq.url = '/health';
    const onSpy = jest.spyOn(mockRes, 'on' as any);

    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(onSpy).not.toHaveBeenCalled();
  });

  it('debe saltar el log para /favicon.ico', () => {
    mockReq.originalUrl = '/favicon.ico';
    mockReq.url = '/favicon.ico';
    const onSpy = jest.spyOn(mockRes, 'on' as any);

    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    expect(onSpy).not.toHaveBeenCalled();
  });
});
