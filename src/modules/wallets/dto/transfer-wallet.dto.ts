import { Min, IsInt, IsNotEmpty } from 'class-validator';

export class TransferWalletDto {
  @Min(1, { message: 'Минимальное количество монет для пополнения - 1' })
  @IsInt({ message: 'Введите корректное число!' })
  readonly amount: number;

  @IsNotEmpty()
  readonly receiver: string;
}
