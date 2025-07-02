import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WarrantyDto {
  @ApiProperty({ example: true, description: 'If the product has warranty or not' })
  @IsOptional()
  @IsBoolean({ message: 'Warranty status must be a boolean' })
  status?: boolean;

  @ApiProperty({ example: '1 year', description: 'Warranty description' })
  @IsOptional()
  @IsString({ message: 'Warranty value must be a string' })
  value?: string;
}