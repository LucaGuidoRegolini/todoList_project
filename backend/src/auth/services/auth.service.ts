import { Bcrypt } from '@utils/bCrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateJwtDto, RefreshTokenDto } from '../dto/jwt.dto';
import {
  AuthenticationResponse,
  LoginUserRequest,
  TokenResponse,
} from '../dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateJWTTokens(payload: CreateJwtDto): TokenResponse {
    const refresh_token = this.getRefreshToken(payload);
    const access_token = this.jwtService.sign(payload);
    return {
      access_token: this.jwtService.sign(payload),
      access_token_expiry: this.jwtService.decode(access_token).exp,
      refresh_token: this.getRefreshToken(payload),
      refresh_token_expiry: this.jwtService.decode(refresh_token).exp,
    };
  }

  private getRefreshToken(payload: RefreshTokenDto) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.findOne(username);
    if (user && Bcrypt.compare(password, user.password)) {
      return user;
    }
    return undefined;
  }

  async login(user: LoginUserRequest): Promise<AuthenticationResponse> {
    return {
      user: {
        id: user.user_id,
        email: user.email,
      },
      ...this.generateJWTTokens({
        email: user.email,
        sub: user.user_id,
        token: user.token,
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthenticationResponse> {
    try {
      const payload = this.jwtService.verify<RefreshTokenDto>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const new_user = await this.usersService.validRefreshToken(
        payload.sub,
        payload.token,
      );

      if (!new_user) throw new UnauthorizedException('Invalid refresh token');

      return {
        user: {
          id: new_user.id,
          email: new_user.email,
        },
        ...this.generateJWTTokens({
          email: payload.email,
          sub: payload.sub,
          token: new_user.refresh_token,
        }),
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
