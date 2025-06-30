import { IsNotEmpty, IsUUID } from 'class-validator';
import { HasMimeType, IsFile } from 'nestjs-form-data';

export class CreateNewDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly shortStory: string;

  @IsNotEmpty()
  readonly fullStory: string;

  @IsNotEmpty()
  readonly time: number;

  @IsUUID()
  readonly category: string;

  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png'])
  readonly preview: any;
}
