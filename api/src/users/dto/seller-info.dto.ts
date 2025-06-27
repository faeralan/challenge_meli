import { ApiProperty } from '@nestjs/swagger';

export class SellerInfoDto {
  @ApiProperty({ example: 'SELLER001' })
  id: string;

  @ApiProperty({ example: 'TechStore Premium' })
  name: string;

  @ApiProperty({ example: 4.8 })
  reputation: number;

  @ApiProperty({ example: 'Capital Federal, Buenos Aires' })
  location: string;

  @ApiProperty({ example: 2847 })
  salesCount: number;

  @ApiProperty({ example: '2018-03-15T00:00:00.000Z' })
  joinDate: Date;

  @ApiProperty({ example: true })
  isVerified: boolean;
} 