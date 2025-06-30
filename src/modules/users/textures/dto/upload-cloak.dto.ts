import { IsNotEmpty, MaxLength } from "class-validator";
import { HasMimeType, IsFile } from "nestjs-form-data";

export class UploadCloakDto {
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    readonly file: any;
}