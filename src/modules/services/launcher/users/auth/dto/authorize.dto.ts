import { IsBoolean, IsIP, IsNotEmpty } from "class-validator";

class Context {
    @IsIP("4")
    readonly ip: string;
}

class Password {
    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly totpCode?: string;
}

export class AuthorizeDto {
    @IsNotEmpty()
    readonly login: string;
    
    @IsNotEmpty()
    readonly context: Context | null;

    @IsNotEmpty()
    readonly password: Password;
}