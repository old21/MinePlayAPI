import { IsOptional, Min, IsInt } from 'class-validator';

export class ReplenishWalletDto {
  @Min(1, { message: 'Минимальное количество монет для пополнения - 1' })
  @IsInt({ message: 'Введите корректное число!' })
  readonly amount: number;

  @IsOptional()
  readonly userId: string;
}
