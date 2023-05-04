import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class LowercaseAddressPipe implements PipeTransform {
  transform(value: SignUpDto, metadata: ArgumentMetadata) {
    value.publicAddress = value.publicAddress.toLowerCase();

    return value;
  }
}
