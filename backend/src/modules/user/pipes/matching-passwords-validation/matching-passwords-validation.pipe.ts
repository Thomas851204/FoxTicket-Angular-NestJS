import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RegisterDto } from '../../models/dtos/register.dto';

@Injectable()
export class MatchingPasswordsValidationPipe implements PipeTransform {
  transform(value: any) {
    const passwordDto = plainToClass(RegisterDto, value);
    if (passwordDto.password !== passwordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }
    return value;
  }
}
