import { Module } from '@nestjs/common';
import { TodoService } from './services/todo.service';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';

@Module({
  providers: [
    TodoService,
    {
      provide: 'ITodoRepository',
      useClass: TodoRepository,
    },
  ],
  controllers: [TodoController],
})
export class TodoModule {}
