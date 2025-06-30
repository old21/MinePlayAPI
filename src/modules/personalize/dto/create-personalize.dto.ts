import { IsHexColor, IsNotEmpty, IsPositive, IsUUID, Max, Min } from "class-validator";
import { PersonalizeTypes } from "../personalize.types";
import { CreateShopItemDto } from "src/modules/shop/dto/Create-shop-item.dto";
import { PersonalizeRarity } from "../rarity/personalize.rarity.entity";

export class CreatePersonalizeDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly description: string;

    @Min(0)
    @Max(6)
    readonly placement: PersonalizeTypes;

    @IsUUID()
    rarity: string;

    @IsNotEmpty()
    readonly shop: CreateShopItemDto[];
}