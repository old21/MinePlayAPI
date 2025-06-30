import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ExchangeBills } from '../wallets.types';

export class ExchangeWalletDto {
  @Min(1, { message: 'Минимальное количество монет для обмена - 1' })
  readonly amount: number;

  @IsNotEmpty({ message: 'Выберите счёт для обмена!' })
  readonly bill: ExchangeBills;

  @IsOptional()
  readonly userId: string;
}
