// import { ApiProperty } from '@nestjs/swagger';
// import { IsISO8601, IsNotEmpty, IsOptional, IsString, IsInt, IsEnum, IsBoolean, isEnum } from 'class-validator';
// import { OperatorClass } from '@prisma/client';


// export class CreateOperatorDto {

//   @ApiProperty({
//     description: 'Classe tática do jogador/operator (ASSAULT, SNIPER, etc.)',
//     example: OperatorClass.ASSAULT,
//     enum: OperatorClass,
//   })
//   @IsEnum(OperatorClass)
//   @IsOptional()
//   class?: OperatorClass; 

  

//   @ApiProperty({
//     description: 'ID do Time',
//     example: 5,
//   })
//   @IsOptional()
//   @IsInt()
//   teamId?: number; 
// }

// src/operator/dto/create-operator.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional, IsString, IsInt } from 'class-validator';
import { OperatorClass } from '@prisma/client';

export class CreateOperatorDto {

  @ApiProperty({
    description: 'Classe tática do jogador (ASSAULT, SNIPER, etc.)',
    example: OperatorClass.FUZILEIRO,
    enum: OperatorClass, 
  })
  @IsEnum(OperatorClass)
  @IsOptional() 
  class?: OperatorClass;

  @ApiProperty({
    description: 'ID do Time ao qual o jogador será associado.',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiProperty({
    description: 'Define se é a primeira participação do jogador em um evento.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFirstTime?: boolean;

  @ApiProperty({
    description: 'Dias de participação confirmados (lista de strings).',
    example: ['Sábado', 'Domingo'],
    type: [String], 
  })
  @IsOptional()
  @IsString({ each: true })
  participationDays?: string[];

  @ApiProperty({
    description: 'Comentários adicionais sobre o jogador.',
    example: 'Traz rádio de comunicação de longo alcance.',
  })
  @IsOptional()
  @IsString()
  comments?: string;
}