import { CustomHttpExceptionResponse } from '@errors/http_error.dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserWeb } from '../dto/user.dto';

export function CreateUserDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Create user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User created successfully.',
      type: UserWeb,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid user data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}

export function UpdateUserDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Update user' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User updated successfully.',
      type: UserWeb,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid user data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}
