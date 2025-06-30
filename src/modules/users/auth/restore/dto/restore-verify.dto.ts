import { IsEmail, IsNumber, Max, Min } from 'class-validator';

export class RestoreVerifyDto {
  @IsEmail(undefined, { message: 'Введите корректный email!' })
  readonly email: string;

  @IsNumber(undefined, { message: 'Введите корректный код!' })
  @Min(10000, { message: 'Введите корректный код!' })
  @Max(99999, { message: 'Введите корректный код!' })
  readonly code: number;
}
