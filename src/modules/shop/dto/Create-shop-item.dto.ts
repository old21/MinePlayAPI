import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateShopItemDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly money: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly coins: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly keys: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly period: number;

  @IsOptional()
  readonly periodName: number;
}
