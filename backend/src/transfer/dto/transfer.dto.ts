import { IsEthereumAddress, IsString } from 'class-validator';

export class TransferDto {
  @IsEthereumAddress()
  from: string;

  @IsEthereumAddress()
  to: string;

  @IsString()
  id: string;
}
