import { IsEmail, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail(undefined, {
    message: 'Введите корректный адрес электронной почты!',
  })
  readonly email: string;
}

export class ChangeEmailConfirmDto {
  @IsUUID()
  readonly confirmationId: string;

  @IsNotEmpty()
  @Min(100000)
  @Max(999999)
  readonly code: number;
}
