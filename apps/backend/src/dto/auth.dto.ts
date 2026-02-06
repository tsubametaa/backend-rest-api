import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Sanitize } from 'src/security/sanitize';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Sanitize()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Sanitize()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Sanitize()
  password: string;
}
