import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { ITodoRepository } from './interfaces/todo.repository.interface';
import { TodoMap } from './todo.map';
import { TodoDomain } from './domain/todo.entity';
import { ToDo, User } from '@prisma/client';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(todo: TodoDomain): Promise<TodoDomain> {
    const todo_prisma: ToDo = TodoMap.toPrisma(todo);
    const resp = await this.prismaService.toDo.create({
      data: todo_prisma,
    });
    return TodoMap.toDomain(resp);
  }

  async update(todo: TodoDomain): Promise<TodoDomain> {
    const todo_prisma: ToDo = TodoMap.toPrisma(todo);
    const resp = await this.prismaService.toDo.update({
      where: { id: todo.id },
      data: todo_prisma,
    });
    return TodoMap.toDomain(resp);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.toDo.delete({ where: { id } });
  }

  async findByUserId(user_id: string): Promise<TodoDomain[]> {
    const resp = await this.prismaService.toDo.findMany({
      where: { user_id },
    });
    if (!resp) return null;
    return resp.map((todo) => TodoMap.toDomain(todo));
  }

  async findById(id: string): Promise<TodoDomain | null> {
    const resp = await this.prismaService.toDo.findUnique({ where: { id } });
    if (!resp) return null;
    return TodoMap.toDomain(resp);
  }
}
