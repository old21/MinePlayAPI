import { IsNotEmpty } from "class-validator";

export class SetSkinDto {
    @IsNotEmpty()
    readonly skinId: string;
}