import { Request, Response } from 'express';
import { IntRange } from './utility.interface';

export type ErrorResponse<T> = {
  code: IntRange<400, 599>;
  error: string;
  data: T | null;
};

export type SuccessResponse<T> = {
  code: 200;
  error: null;
  data: T;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse<T>;

export function createFailureResponse<T>(
  code: IntRange<400, 599>,
  error: string,
  data: T | null = null
): ErrorResponse<T> {
  const response: ErrorResponse<T> = {
    code,
    error,
    data,
  };
  return response;
}

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    code: 200,
    data: data,
    error: null,
  };
  return response;
}

export function processResponse<T>(
  _request: Request,
  response: Response,
  data: ApiResponse<T>
) {
  return response.status(data.code).send(data);
}

export function processFileResponse<T>(
  _request: Request,
  response: Response,
  data: ApiResponse<T>,
  filename: string
) {
  if (!data.data) {
    return response.status(data.code).send(data);
  }
  response.attachment(filename);
  response.contentType(filename);
  return response.status(data.code).send(data.data);
}

export default ApiResponse;
