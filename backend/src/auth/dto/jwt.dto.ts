export class CreateJwtDto {
  email: string;
  sub: string;
  token: string;
}

export class JwtPayloadDto {
  email: string;
  sub: string;
}

export class RefreshTokenDto {
  email: string;
  sub: string;
  token: string;
}
