import { IsIP, IsNotEmpty, IsNumber } from 'class-validator';

class Address {
  @IsIP('4')
  readonly ip: string;

  @IsNumber()
  readonly port: number;
}

export class CreateServerDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly address: Address;

  @IsNotEmpty()
  readonly description: string;
}
