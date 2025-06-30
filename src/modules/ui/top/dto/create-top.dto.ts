import { IsNotEmpty } from "class-validator";
import { HasMimeType, IsFile } from "nestjs-form-data";

export class CreateTopDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;
    
    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    readonly background: any;

    @IsFile()
    @HasMimeType(['image/jpeg', 'image/png'])
    readonly render: any;
}