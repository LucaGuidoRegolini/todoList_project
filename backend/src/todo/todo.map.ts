import { ToDo } from '@prisma/client';
import { TodoWeb } from './dto/todo.dto';
import { TodoDomain } from './domain/todo.entity';

export class TodoMap {
  static toWeb(todo: TodoDomain): TodoWeb {
    return {
      id: todo.id,
      title: todo.title,
      isDone: todo.isDone,
    };
  }

  static toDomain(user: ToDo): TodoDomain {
    return new TodoDomain({
      id: user.id,
      title: user.title,
      isDone: user.isDone,
      user_id: user.user_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }

  static toPrisma(user: TodoDomain): ToDo {
    return {
      id: user.id,
      title: user.title,
      isDone: user.isDone,
      user_id: user.userId,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
