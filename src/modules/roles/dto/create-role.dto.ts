import { IsHexColor, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { HasMimeType, IsFile } from 'nestjs-form-data';

export class CreateRoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly prefix: string;

  @IsNotEmpty()
  readonly permissions: string;

  @IsOptional()
  @IsHexColor()
  readonly prefixColor: string;

  @IsOptional()
  @IsHexColor()
  readonly nickColor: string;

  @IsOptional()
  @IsHexColor()
  readonly messageColor: string;

  @IsNotEmpty()
  readonly isDefault: boolean;

  @IsNotEmpty()
  readonly isDonate: boolean;

  @IsOptional()
  readonly needForEquip?: number;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/png'])
  readonly cardFront?: any;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/png'])
  readonly cardRear?: any;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/png'])
  readonly tagStandart?: any;

  @IsOptional()
  @IsFile()
  @HasMimeType(['image/png'])
  readonly tagPlus?: any;
}
