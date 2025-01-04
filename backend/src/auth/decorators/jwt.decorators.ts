import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Authenticated() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}
