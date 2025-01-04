import { TodoDomain } from '@src/todo/domain/todo.entity';
import { CreateTodoDto } from '@src/todo/dto/todo.dto';

describe('ProductDomain', () => {
  let todoData: CreateTodoDto;
  let todoDomain: TodoDomain;

  beforeEach(() => {
    todoData = {
      id: '1',
      title: 'My todo',
      isDone: false,
      user_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
    };

    todoDomain = new TodoDomain(todoData);
  });

  describe('constructor', () => {
    it('should create an instance of TodoDomain with correct values', () => {
      expect(todoDomain.id).toBe(todoData.id);
      expect(todoDomain.title).toBe(todoData.title);
      expect(todoDomain.userId).toBe(todoData.user_id);
    });
  });

  describe('setters', () => {
    it('should update values using setters', () => {
      todoDomain.setTitle('New Todo');
      expect(todoDomain.title).toBe('New Todo');

      todoDomain.setIsDone(true);
      expect(todoDomain.isDone).toBe(true);
    });
  });
});
