import { IsNumber } from 'class-validator';

export class LikeNewDto {
  @IsNumber()
  readonly newId: number;
}
