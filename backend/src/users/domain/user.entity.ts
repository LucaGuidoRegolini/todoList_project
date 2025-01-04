import { Domain } from '@domain/index';
import { CreateUserDto } from '../dto/user.dto';
import { Bcrypt } from '@utils/bCrypt';
import { bcrypt_salt } from '@config/auth';

export class UserDomain extends Domain {
  private _name: string;
  private _email: string;
  private _password?: string;
  private _refreshToken?: string;
  private _createdAt: Date;
  private _updatedAt?: Date;

  constructor(data: CreateUserDto) {
    super(data.id);
    this._name = data.name;
    this._email = data.email;
    this._password = data.password_hash;
    this._refreshToken = data.refresh_token;
    this._createdAt = data.created_at || new Date();
    this._updatedAt = data.updated_at || new Date();
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get refresh_token(): string | undefined {
    return this._refreshToken;
  }

  get updated_at(): Date | undefined {
    return this._updatedAt;
  }

  get created_at(): Date {
    return this._createdAt;
  }

  get password(): string | undefined {
    return this._password;
  }

  public setEmail(email: string): UserDomain {
    this._email = email;
    return this;
  }

  public setName(name: string): UserDomain {
    this._name = name;
    return this;
  }

  public setRefreshToken(token: string): UserDomain {
    this._refreshToken = token;
    return this;
  }

  private hashPassword(password: string): string {
    return Bcrypt.hash(password, bcrypt_salt);
  }

  public setPassword(password: string): UserDomain {
    this._password = this.hashPassword(password);
    return this;
  }
}
