import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TodoWeb {
  @ApiProperty({
    example: 'ab508ddb-70d0-4710-af5a-d80e87e26ca8',
    description: 'Todo ID',
  })
  id: string;

  @ApiProperty({ example: 'My todo', description: 'Todo title' })
  title: string;

  @ApiProperty({ example: false, description: 'Todo status' })
  isDone: boolean;
}

export type CreateTodoDto = {
  id?: string;
  title: string;
  isDone: boolean;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class CreateTodoRequest {
  @ApiProperty({ example: 'My todo', description: 'Todo title' })
  title: string;
}

export class UpdateTodoRequest {
  @ApiProperty({ example: 'My todo', description: 'Todo title' })
  title: string;

  @ApiProperty({ example: false, description: 'Todo status' })
  @IsOptional()
  isDone?: boolean;
}
