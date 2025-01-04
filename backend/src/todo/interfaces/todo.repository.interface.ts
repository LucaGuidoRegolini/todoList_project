import { TodoDomain } from '../domain/todo.entity';

export interface ITodoRepository {
  create(todo: TodoDomain): Promise<TodoDomain>;
  update(todo: TodoDomain): Promise<TodoDomain>;
  findById(id: string): Promise<TodoDomain | null>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<TodoDomain[]>;
}
