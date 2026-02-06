import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Sanitize } from 'src/security/sanitize';

export class CreateBukuDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Sanitize()
  judul: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Sanitize()
  isbn?: string;

  @IsInt()
  @IsOptional()
  @Min(1000)
  @Max(9999)
  @Sanitize()
  tahunTerbit?: number;

  @IsUUID()
  @IsNotEmpty()
  penulisId: string;
}

export class UpdateBukuDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Sanitize()
  judul?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Sanitize()
  isbn?: string;

  @IsInt()
  @IsOptional()
  @Min(1000)
  @Max(9999)
  @Sanitize()
  tahunTerbit?: number;

  @IsUUID()
  @IsOptional()
  penulisId?: string;
}
