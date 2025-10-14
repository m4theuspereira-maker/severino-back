import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'email',
    example: 'user_email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Full name user',
    example: 'José da Silva',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cpf number',
    example: '755.315.220-02',
  })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'valid user number with DDD',
    example: '(66) 93833-0736',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Username',
    example: 'zezinho',
  })
  username: string;

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Set if the user is admin or not',
    example: false,
  })
  @IsNotEmpty()
  isAdmin: boolean;

  @ApiProperty({
    description: 'indication id',
    example: '225e6w',
  })
  @IsOptional()
  indicatedId: string;

  @ApiProperty({
    description: 'is influencer',
    example: false,
    default: false,
  })
  @IsNotEmpty()
  isInfluencer: boolean;
  indicatedDate?: Date;
}

export class LoginDto {
  @ApiProperty({
    description: 'email',
    example: 'user_email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;
}

export class ResetPassword {
  @ApiProperty({
    description: 'email',
    example: 'user_email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'password',
    example: '654321',
  })
  @IsNotEmpty()
  oldPassword: string;
}

export class CreateUserWithIndicationLink {
  @ApiProperty({
    description: 'indication Id',
    example: 'yo6n30',
  })
  @IsNotEmpty()
  indicationId: string;
}

export class UserDtoWithIndication {
  @ApiProperty({
    description: 'email',
    example: 'user_email@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Full name user',
    example: 'José da Silva',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cpf number',
    example: '755.315.220-02',
  })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'valid user number with DDD',
    example: '(66) 93833-0736',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Username',
    example: 'zezinho',
  })
  username: string;

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Set if the user is admin or not',
    example: false,
  })
  @IsNotEmpty()
  isAdmin: boolean;
  indicatedId: string;

  @ApiProperty({
    description: 'is influencer',
    example: false,
    default: false,
  })
  @IsNotEmpty()
  isInfluencer: boolean;
  indicaticatedDate?: Date;
}

export class GetDateRangeDto {
  @ApiProperty({
    description: 'Data inicial no formato ISO 8601',
    example: '2024-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: Date;

  @ApiProperty({
    description: 'Data final no formato ISO 8601',
    example: '2024-09-10T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: Date;
}
