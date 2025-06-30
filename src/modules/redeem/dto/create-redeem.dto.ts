import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { RedeemTypes } from '../redeem.types';

export class CreateRedeemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly value: number;
}

export class CreateAdminRedeemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly value: number;

  @IsNotEmpty()
  readonly code: string;

  @IsInt()
  @IsPositive()
  readonly type: RedeemTypes;
}
