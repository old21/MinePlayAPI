import {
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @MinLength(3, { message: 'Минимальная длинна ника - 3 символа!' })
  @MaxLength(15, { message: 'Максимальная длинна ника - 15 символов!' })
  @Matches('^[А-Яа-яA-Za-z0-9_]*$', undefined, {
    message:
      'Ник может содержать только буквы русского, английского алфавита и цифры',
  })
  readonly name: string;

  @IsEmail(undefined, {
    message: 'Введите корректный адрес электронной почты!',
  })
  readonly email: string;

  @MinLength(8, { message: 'Минимальная длинна пароля - 8 символов!' })
  readonly password: string;

  readonly invitedBy?: string;
}
