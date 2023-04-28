import { IsEmail, IsString, IsEthereumAddress } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsEthereumAddress()
  publicAddress: string;
}
