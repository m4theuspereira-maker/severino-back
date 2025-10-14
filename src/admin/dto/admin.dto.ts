import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GetPaymentDataDto {
  @ApiProperty({
    description: 'Quantidade de linhas que serão ignoradas na paginação',
    example: 0,
  })
  @IsNotEmpty()
  skip: number;

  @ApiProperty({
    description:
      'Quantidade de linhas que serão trazidas na request da paginação',
    example: 10,
  })
  @IsNotEmpty()
  take: number;
}

export class GetWithdrawRequestsDto extends GetPaymentDataDto {
  @ApiProperty({
    description: 'Cpf do usuário',
    example: '847.095.210-26',
    required: false,
  })
  @IsOptional()
  cpf: string;
}

export class AcceptWithdrawRequestDto {
  @ApiProperty({
    description: 'Id da solicitação de saque ',
    example: 1,
  })
  @IsNotEmpty()
  id: number;
}

export class GetUserByTextDto {
  @ApiProperty({
    description: 'search term ',
    example: 'zezinho',
  })
  @IsNotEmpty()
  search: string;
}
