import { ApiProperty } from '@nestjs/swagger';

export class CustomHttpExceptionResponse {
  @ApiProperty({
    example: 400,
    description: 'The HTTP status code of the error.',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Validation failed',
    description: 'Main error message summarizing the issue.',
  })
  main_message: string;

  @ApiProperty({
    example: [
      'email should not be empty',
      'password must be longer than 6 characters',
    ],
    description: 'Array of detailed error messages explaining each issue.',
    type: [String],
  })
  messages: string[];

  @ApiProperty({
    example: 'VALIDATION_ERROR',
    description: 'Type of error for categorization purposes.',
  })
  error_type: string;

  @ApiProperty({
    example: 'GENERIC_VALIDATION_ERROR',
    description: 'Optional type for specifying validation-related errors.',
    required: false,
  })
  validation_type?: string;

  @ApiProperty({
    example: '/api/v1/users',
    description: 'The path where the error occurred.',
  })
  path: string;
}
