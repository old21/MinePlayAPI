import { Reflector } from '@nestjs/core';

export const Token = Reflector.createDecorator<string>();