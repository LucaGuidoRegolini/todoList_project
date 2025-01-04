import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  user_id: string;
  email: string;
  token: string;
}

export class TokenResponse {
  access_token: string;
  access_token_expiry: number;
  refresh_token: string;
  refresh_token_expiry: number;
}

export class AuthenticationResponse extends TokenResponse {
  @ApiProperty({
    description: 'User details',
    example: {
      id: 'ab508ddb-70d0-4710-af5a-d80e87e26ca8',
      email: 'user@example.com',
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNT...',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNT...',
      refresh_token_expiry: 1736564894,
    },
  })
  user: {
    id: string;
    email: string;
  };
}

export interface UserRequestObject {
  email: string;
  userId: string;
}
