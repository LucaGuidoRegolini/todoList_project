import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ITodoRepository } from '../interfaces/todo.repository.interface';
import { TodoDomain } from '../domain/todo.entity';
import { CreateTodoRequest, UpdateTodoRequest } from '../dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject('ITodoRepository')
    private readonly todoRepository: ITodoRepository,
  ) {}

  async listUser(user_id: string): Promise<TodoDomain[]> {
    return this.todoRepository.findByUserId(user_id);
  }

  async create(
    createUserDto: CreateTodoRequest,
    user_id: string,
  ): Promise<TodoDomain> {
    const todo = new TodoDomain({
      title: createUserDto.title,
      user_id: user_id,
      isDone: false,
    });
    return this.todoRepository.create(todo);
  }

  async update(
    user_id: string,
    id: string,
    todo: UpdateTodoRequest,
  ): Promise<TodoDomain> {
    const todo_exists = await this.todoRepository.findById(id);

    if (!todo_exists) {
      throw new BadRequestException("Todo doesn't exist");
    }

    if (todo_exists.userId !== user_id) {
      throw new BadRequestException("Todo doesn't belong to user");
    }

    const new_todo = new TodoDomain({
      id: todo_exists.id,
      title: todo.title || todo_exists.title,
      isDone: todo.hasOwnProperty('isDone') ? todo.isDone : todo_exists.isDone,
      user_id: todo_exists.userId,
    });

    return this.todoRepository.update(new_todo);
  }

  async delete(id: string, user_id: string): Promise<void> {
    const todo_exists = await this.todoRepository.findById(id);

    if (!todo_exists) {
      throw new BadRequestException("Todo doesn't exist");
    }

    if (todo_exists.userId !== user_id) {
      throw new BadRequestException("Todo doesn't belong to user");
    }

    return this.todoRepository.delete(id);
  }
}
