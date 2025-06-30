import { IsEmail } from 'class-validator';

export class RestoreAuthDto {
  @IsEmail(undefined, { message: 'Введите корректный email!' })
  readonly email: string;
}
