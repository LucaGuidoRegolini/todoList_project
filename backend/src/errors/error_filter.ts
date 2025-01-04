import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomHttpExceptionResponse } from './http_error.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let customResponse: CustomHttpExceptionResponse = {
      statusCode: status,
      main_message: 'Internal server error',
      messages: [],
      error_type: 'INTERNAL_SERVER_ERROR',
      path: request.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const error_messages = exceptionResponse['message'] as string[] | string;
      const messages = Array.isArray(error_messages)
        ? error_messages
        : [error_messages];

      const isValidationError = exception instanceof BadRequestException;

      const [error_type, validation_type] = isValidationError
        ? ['VALIDATION_ERROR', 'GENERIC_VALIDATION_ERROR']
        : [this.getErrorType(exception), undefined];

      customResponse = {
        statusCode: status,
        main_message: exception.message,
        messages,
        error_type,
        validation_type,
        path: request.url,
      };
    }

    console.log(exception);

    response.status(status).json(customResponse);
  }

  private getErrorType(exception: HttpException): string {
    if (exception instanceof NotFoundException) {
      return 'NOT_FOUND';
    }
    if (exception instanceof UnauthorizedException) {
      return 'UNAUTHORIZED';
    }
    if (exception instanceof BadRequestException) {
      return 'BAD_REQUEST';
    }
    return 'INTERNAL_SERVER_ERROR';
  }
}
