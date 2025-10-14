import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({
    description: 'betValue in cents',
    example: 10000,
  })
  @IsNotEmpty()
  betValue: number;
  @ApiProperty({
    description: 'match status',
    example: 'PENDING | PAID | CONFIRMED | INSUFFICIENT_FUNDS',
  })
  @IsOptional()
  status: string;
  @ApiProperty({
    description: 'song id',
    example: 0,
  })
  @IsNotEmpty()
  songId: number;
}

export class UpdateMachDto {
  @ApiProperty({
    description: 'matchId',
    example: 1,
  })
  @IsNotEmpty()
  matchId: number;
  @ApiProperty({
    description: 'match status',
    example: 'FINISHED',
  })
  @IsNotEmpty()
  status: $Enums.MatchStatus;
  @ApiProperty({
    description: 'balanceId',
    example: 1,
  })
  balanceId: number;
  @ApiProperty({
    description: 'userId',
    example: 1,
  })
  userId: number;
  @ApiProperty({
    description: 'bet value ',
    example: 1,
  })
  betValue: number;

  @ApiProperty({
    description: 'bet value',
    example: 1,
  })
  message: string;
  @ApiProperty({
    description: 'bet value',
    example: 1,
  })
  apiKey: string;
  @ApiProperty({
    description: "money",
    example: 2
  })
  money: number;
}


export class PaginatedRequestDto {
  @ApiProperty({
    description: 'skip',
    example: 0,
  })
  skip: number

  @ApiProperty({
    description: "take",
    example: 10
  })
  take: number
}
