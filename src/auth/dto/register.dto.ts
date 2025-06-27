import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'seller@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'TechStore Premium' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Capital Federal, Buenos Aires' })
  @IsString()
  location: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isVerified?: boolean;
} 