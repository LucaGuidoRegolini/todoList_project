import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserWeb {
  @ApiProperty({
    example: 'ab508ddb-70d0-4710-af5a-d80e87e26ca8',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;
}

export type CreateUserDto = {
  id?: string;
  email: string;
  name: string;
  password_hash?: string;
  refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class CreateUserRequest {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
