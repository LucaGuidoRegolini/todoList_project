import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoMap } from './todo.map';
import { Request } from 'express';
import {
  CreateTodoDto,
  UpdateTodoRequest,
  TodoWeb,
  CreateTodoRequest,
} from './dto/todo.dto';
import {
  CreateTodoDocumentation,
  DeleteTodoDocumentation,
  GetTodoDocumentation,
  UpdateTodoDocumentation,
} from './decorators/todo.decorators';
import { Authenticated } from '@src/auth/decorators/jwt.decorators';

@Controller('tasks')
export class TodoController {
  constructor(private usersService: TodoService) {}

  @CreateTodoDocumentation()
  @Authenticated()
  @Post()
  async create(
    @Req() req: Request,
    @Body() createTodoDto: CreateTodoRequest,
  ): Promise<TodoWeb> {
    const task = await this.usersService.create(createTodoDto, req.user.userId);

    return TodoMap.toWeb(task);
  }

  @UpdateTodoDocumentation()
  @Authenticated()
  @Put('/:taskId')
  async update(
    @Req() req: Request,
    @Body() updateTodoRequest: UpdateTodoRequest,
    @Param('taskId') taskId: string,
  ): Promise<TodoWeb> {
    const task = await this.usersService.update(
      req.user.userId,
      taskId,
      updateTodoRequest,
    );

    return TodoMap.toWeb(task);
  }

  @GetTodoDocumentation()
  @Authenticated()
  @Get('/')
  async get(@Req() req: Request): Promise<TodoWeb[]> {
    const tasks = await this.usersService.listUser(req.user.userId);

    return tasks.map((task) => TodoMap.toWeb(task));
  }

  @DeleteTodoDocumentation()
  @Authenticated()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:taskId')
  async delete(
    @Req() req: Request,
    @Param('taskId') id: string,
  ): Promise<void> {
    this.usersService.delete(id, req.user.userId);
  }
}
