import { IsHexColor, IsNotEmpty } from "class-validator";

export class CreatePersonalizeRarityDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly description: string;

    @IsHexColor()
    readonly background: string;

    @IsHexColor()
    readonly text: string;
}