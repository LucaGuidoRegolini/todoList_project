import { CustomHttpExceptionResponse } from '@errors/http_error.dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TodoWeb } from '../dto/todo.dto';

export function CreateTodoDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Create Task' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Task created successfully.',
      type: TodoWeb,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid task data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}

export function UpdateTodoDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Update Task' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Task updated successfully.',
      type: TodoWeb,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid task data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}

export function GetTodoDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Get Tasks for User' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Tasks retrieved successfully.',
      type: [TodoWeb],
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid task data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}

export function DeleteTodoDocumentation() {
  return applyDecorators(
    ApiOperation({ description: 'Delete Task' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Task deleted successfully.',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid task data.',
      type: CustomHttpExceptionResponse,
    }),
  );
}
