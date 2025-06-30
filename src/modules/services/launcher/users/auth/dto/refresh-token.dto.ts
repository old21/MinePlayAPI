import { IsBoolean, IsIP, IsNotEmpty } from "class-validator";

class Context {
    @IsIP("4")
    readonly ip: string;
}
export class RefreshTokenDto {
    @IsNotEmpty()
    readonly refreshToken: string;
    
    @IsNotEmpty()
    readonly context: Context | null;
}