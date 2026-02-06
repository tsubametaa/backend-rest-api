import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Sanitize } from 'src/security/sanitize';

export class CreatePenulisDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Sanitize()
  nama: string;

  @IsString()
  @IsOptional()
  @Sanitize()
  bio?: string;
}

export class UpdatePenulisDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Sanitize()
  nama?: string;

  @IsString()
  @IsOptional()
  @Sanitize()
  bio?: string;
}
