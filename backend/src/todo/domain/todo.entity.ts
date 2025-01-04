import { Domain } from '@domain/index';
import { CreateTodoDto } from '../dto/todo.dto';

export class TodoDomain extends Domain {
  private _title: string;
  private _isDone: boolean;
  private _userId: string;
  private _createdAt: Date;
  private _updatedAt?: Date;

  constructor(data: CreateTodoDto) {
    super(data.id);
    this._title = data.title;
    this._isDone = data.isDone || false;
    this._userId = data.user_id;
    this._createdAt = data.created_at || new Date();
    this._updatedAt = data.updated_at || new Date();
  }

  get title(): string {
    return this._title;
  }

  get isDone(): boolean {
    return this._isDone;
  }

  get userId(): string {
    return this._userId;
  }

  get created_at(): Date {
    return this._createdAt;
  }

  get updated_at(): Date {
    return this._updatedAt;
  }

  public setTitle(title: string): TodoDomain {
    this._title = title;
    return this;
  }

  public setIsDone(isDone: boolean): TodoDomain {
    this._isDone = isDone;
    return this;
  }
}
