import { IsNotEmpty } from "class-validator";

export class CheckServerDto {
    @IsNotEmpty()
    readonly username: string;
    

    @IsNotEmpty()
    readonly serverId: string;
}