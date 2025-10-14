import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class GeneratePaymentDto {
  @ApiProperty({
    description: 'name',
    example: 'José da silva',
  })
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'email',
    example: 'user_email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Cpf number',
    example: '755.315.220-02',
  })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'price in cents',
    example: '50000',
  })
  @IsNotEmpty()
  @Min(50000, { message: 'O valor mínimo é de R$ 50,00' })
  price: number;
}

export class AuthenticationHeadersDto {
  @ApiProperty({
    description: 'Authentication Token',
    example: 'Bearer <token>',
  })
  @IsNotEmpty()
  Authorization: string;
  @IsOptional()
  apiKey: string;
  id: number;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Número de itens a serem pulados',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({
    description: 'Número de itens a serem retornados',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}

export class UpdateAmountHeaderDto {
  @ApiProperty({
    description: 'Amount that will be incremented',
    example: 1000,
  })
  @IsNotEmpty()
  amount: number;
}

export class CreateWithDrawRequestDto {
  @ApiProperty({
    description: 'Request amount in cents 100 = R$ 1,00',
    example: 100,
  })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description:
      'Pix key of user account, it can be email, cpf or phone number',
    example: 1199658324,
  })
  @IsNotEmpty()
  pixKey: string;
}

export class GetTransactionStatusDto {
  @ApiProperty({
    description: 'Id da transação zoldpay ',
    example: '3baf3892-c53c-4b62-a1ab-b71e31026c63',
  })
  @IsNotEmpty()
  transactionId: string;
}
