// src/utils/responseHelper.ts
import { Response } from 'express';

export interface ApiResponse<T = unknown, E = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: E;
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    const response: ApiResponse<T> = {
      status: statusCode,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully',
    statusCode = 201,
  ) {
    const response: ApiResponse<T> = {
      status: statusCode,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error<E = unknown>(res: Response, message = 'Error', statusCode = 500, error?: E) {
    const response: ApiResponse<undefined, E> = {
      status: statusCode,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static notFound<T = unknown>(res: Response, message = 'Not found', data?: T) {
    const response: ApiResponse<T> = {
      status: 404,
      message,
      data,
    };
    return res.status(404).json(response);
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    const response: ApiResponse = {
      status: 401,
      message,
    };
    return res.status(401).json(response);
  }

  static badRequest(res: Response, message = 'Bad request') {
    const response: ApiResponse = {
      status: 400,
      message,
    };
    return res.status(400).json(response);
  }
}
