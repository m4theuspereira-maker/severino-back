import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const serverError = (res: Response): Response => {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    errors: [
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      },
    ],
  });
};

export const ok = (res: Response, data?: any): Response => {
  if (!data) {
    return res.status(HttpStatus.OK).json();
  }

  if (Array.isArray(data)) {
    return res.status(HttpStatus.OK).json({ count: data.length, data });
  }

  return res.status(HttpStatus.OK).json(data);
};

export const unaceptedUrl = (res: Response): Response => {
  return res.status(HttpStatus.FORBIDDEN).json({
    errors: [
      {
        code: HttpStatus.FORBIDDEN,
        message: 'Unacepted URL, please use an https URL',
      },
    ],
  });
};

export const conflictError = (res: Response, message: any): Response => {
  return res.status(HttpStatus.CONFLICT).json({ error: message });
};

export const unauthorizedError = (res: Response, message: any): Response => {
  return res.status(HttpStatus.UNAUTHORIZED).json({ error: message });
};

export const notFoundError = (res: Response, message: string): Response => {
  return res.status(HttpStatus.NOT_FOUND).json({ error: message });
};

export const insufficientFunds = (
  res: Response,
  message?: string,
): Response => {
  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ error: message ?? 'Insufficient funds' });
};

export const badRequest = (res: Response, message: string): Response => {
  return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
};

export const redirect = (res: Response, url: string): void => {
  res.redirect(301, url);
};
