import { IsNotEmpty } from "class-validator";

export class JoinServerDto {
    readonly uuid: string;

    readonly username: string;
    
    @IsNotEmpty()
    readonly accessToken: string;

    @IsNotEmpty()
    readonly serverId: string;
}