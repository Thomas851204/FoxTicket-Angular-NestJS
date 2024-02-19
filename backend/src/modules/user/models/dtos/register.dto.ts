import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'username' })
  username: string;

  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'password must include at least one letter and at least one digit',
  })
  @ApiProperty({ type: String, description: 'password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'confirm password' })
  confirmPassword: string;
}
