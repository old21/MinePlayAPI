import { IsNotEmpty, IsString } from "class-validator";

export class PrestarterInitDto {
    @IsNotEmpty()
    readonly arch: string;

    @IsString()
    @IsNotEmpty()
    readonly os: string;
}
