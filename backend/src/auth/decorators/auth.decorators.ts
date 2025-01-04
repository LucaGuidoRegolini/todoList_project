import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthenticationResponse } from '../dto/auth.dto';
import { CustomHttpExceptionResponse } from '@errors/http_error.dto';

export function LoginDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Login user' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User authenticated successfully.',
      type: AuthenticationResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid credentials.',
      type: CustomHttpExceptionResponse,
    }),
    ApiBody({
      description: 'User login credentials',
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password' },
        },
      },
    }),
  );
}

export function RefreshDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Refresh token' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Token refreshed successfully.',
      type: AuthenticationResponse,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid refresh token.',
      type: CustomHttpExceptionResponse,
    }),
    ApiBody({
      description: 'Refresh token',
      schema: {
        type: 'object',
        properties: {
          refresh_token: { type: 'string', example: 'refresh_token' },
        },
      },
    }),
  );
}
