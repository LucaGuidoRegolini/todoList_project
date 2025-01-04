import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TodoService } from '@src/todo/services/todo.service';
import { ITodoRepository } from '@src/todo/interfaces/todo.repository.interface';
import { TodoDomain } from '@src/todo/domain/todo.entity';
import { CreateTodoRequest, UpdateTodoRequest } from '@src/todo/dto/todo.dto';
import { randomUUID } from 'crypto';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: jest.Mocked<ITodoRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: 'ITodoRepository',
          useValue: {
            findByUserId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get('ITodoRepository');
  });

  describe('listUser', () => {
    it('should return todos for the user when found', async () => {
      const userId = 'user-id';
      const todos = [
        new TodoDomain({
          id: 'todo-id-1',
          title: 'Test Todo 1',
          user_id: userId,
          isDone: false,
        }),
        new TodoDomain({
          id: 'todo-id-2',
          title: 'Test Todo 2',
          user_id: userId,
          isDone: true,
        }),
      ];

      todoRepository.findByUserId.mockResolvedValue(todos);

      expect(await todoService.listUser(userId)).toBe(todos);
      expect(todoRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a new todo for the user', async () => {
      const userId = 'user-id';
      const createTodoDto: CreateTodoRequest = { title: 'New Todo' };
      const newTodo = new TodoDomain({
        id: randomUUID(),
        title: createTodoDto.title,
        user_id: userId,
        isDone: false,
      });

      todoRepository.create.mockResolvedValue(newTodo);

      const result = await todoService.create(createTodoDto, userId);
      expect(result.title).toBe(newTodo.title);
      expect(result.userId).toBe(newTodo.userId);
    });
  });

  describe('update', () => {
    it("should throw an error if the todo doesn't exist", async () => {
      const userId = 'user-id';
      const updateTodoDto: UpdateTodoRequest = { title: 'Updated Todo' };
      const id = 'non-existing-id';
      todoRepository.findById.mockResolvedValue(undefined);

      await expect(
        todoService.update(userId, id, updateTodoDto),
      ).rejects.toThrow(new BadRequestException("Todo doesn't exist"));
    });

    it("should throw an error if the todo doesn't belong to the user", async () => {
      const userId = 'user-id';
      const updateTodoDto: UpdateTodoRequest = { title: 'Updated Todo' };
      const existingTodo = new TodoDomain({
        id: 'todo-id',
        title: 'Existing Todo',
        user_id: 'other-user-id',
        isDone: false,
      });

      todoRepository.findById.mockResolvedValue(existingTodo);

      await expect(
        todoService.update(userId, existingTodo.id, updateTodoDto),
      ).rejects.toThrow(new BadRequestException("Todo doesn't belong to user"));
    });

    it('should update the todo if it exists and belongs to the user', async () => {
      const userId = 'user-id';
      const existingTodo = new TodoDomain({
        id: 'todo-id',
        title: 'Existing Todo',
        user_id: userId,
        isDone: false,
      });
      const updatedTodo = new TodoDomain({
        id: 'todo-id',
        title: 'Updated Todo',
        user_id: userId,
        isDone: true,
      });

      todoRepository.findById.mockResolvedValue(existingTodo);
      todoRepository.update.mockResolvedValue(updatedTodo);

      const result = await todoService.update(userId, existingTodo.id, {
        title: 'Updated Todo',
        isDone: true,
      });
      expect(result).toBe(updatedTodo);
      expect(todoRepository.update).toHaveBeenCalledWith(updatedTodo);
    });
  });

  describe('delete', () => {
    it("should throw an error if the todo doesn't exist", async () => {
      const userId = 'user-id';
      const id = 'non-existing-id';
      todoRepository.findById.mockResolvedValue(undefined);

      await expect(todoService.delete(id, userId)).rejects.toThrow(
        new BadRequestException("Todo doesn't exist"),
      );
    });

    it("should throw an error if the todo doesn't belong to the user", async () => {
      const userId = 'user-id';
      const existingTodo = new TodoDomain({
        id: 'todo-id',
        title: 'Existing Todo',
        user_id: 'other-user-id',
        isDone: false,
      });
      todoRepository.findById.mockResolvedValue(existingTodo);

      await expect(todoService.delete(existingTodo.id, userId)).rejects.toThrow(
        new BadRequestException("Todo doesn't belong to user"),
      );
    });

    it('should delete the todo if it exists and belongs to the user', async () => {
      const userId = 'user-id';
      const existingTodo = new TodoDomain({
        id: 'todo-id',
        title: 'Existing Todo',
        user_id: userId,
        isDone: false,
      });
      todoRepository.findById.mockResolvedValue(existingTodo);

      await todoService.delete(existingTodo.id, userId);
      expect(todoRepository.delete).toHaveBeenCalledWith(existingTodo.id);
    });
  });
});
