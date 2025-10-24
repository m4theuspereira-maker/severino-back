import {
  Body,
  Controller,
  Patch,
  Post,
  Res,
  Headers,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  CreateUserWithIndicationLink,
  GetDateRangeDto,
  LoginDto,
  ResetPassword,
  UserDto,
  UserDtoWithIndication,
} from './dto/user.dtos';
import {
  badRequest,
  conflictError,
  insufficientFunds,
  notFoundError,
  ok,
  unauthorizedError,
} from '../@handlers/handlers';
import {
  AuthenticationHeadersDto,
  CreateWithDrawRequestDto,
  UpdateAmountHeaderDto,
} from 'src/payment/dto/payment.dto';
import { NotFoundError } from 'rxjs';
import { AuthenticationGuard } from '../authentication/guards/authenticaiton.guard';
import { PaginatedRequestDto } from 'src/match/dto/match.dto';
import { Public } from '../@decorators/public';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/create')
  @ApiTags('User')
  async createUser(@Body() user: UserDto, @Res() res: Response) {
    const userFound = await this.isUserAlreadyFound(user);

    if (userFound) {
      return conflictError(res, 'User already found');
    }

    if (user?.indicatedId) {
      const userWhoIndicated = await this.userService.find(
        { indicationId: user.indicatedId },
        { indicationId: true },
      );

      // if (!userWhoIndicated) {
      //   return notFoundError(res, 'User who indicated was not found');
      // }
    }

    if (!this.userService.validateCpf(user.cpf)) {
      return badRequest(res, 'CPF is not valid');
    }

    const result = await this.userService.createUser(user);

    return ok(res, result);
  }

  @Post('/create/indication')
  @ApiTags('User')
  async createUserWithIndication(
    @Query() { indicationId }: CreateUserWithIndicationLink,
    @Body() user: UserDtoWithIndication,
    @Res() res: Response,
  ) {
    const userFound = await this.isUserAlreadyFound(user);

    if (userFound) {
      return conflictError(res, 'User already found');
    }

    const userWhoIndicated = await this.userService.find(
      { indicationId },
      { indicationId: true },
    );

    if (!userWhoIndicated) {
      return notFoundError(res, 'User who indicated was not found');
    }

    if (!this.userService.validateCpf(user.cpf)) {
      return badRequest(res, 'CPF is not valid');
    }

    const result = await this.userService.createUser({
      ...user,
      indicatedId: indicationId,
      indicatedDate: new Date(),
    });

    return ok(res, result);
  }

  @Post('/login')
  @Public()
  @ApiTags('User')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(
    @Body()
    { email, password }: LoginDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.login(email, password);

    if (!result) {
      return unauthorizedError(res, 'email or password is invalid');
    }

    return ok(res, result);
  }

  @Patch('/reset')
  @ApiTags('User')
  async resetPassword(
    @Body()
    { email, password, oldPassword }: ResetPassword,
    @Res() res: Response,
  ) {
    const result = await this.userService.resetPassword(
      email,
      oldPassword,
      password,
    );

    if (!result) {
      return unauthorizedError(
        res,
        'The old password or email does not match with what is in our database',
      );
    }
    return ok(res, result);
  }

  @Post('/withdraw')
  @ApiTags('User')
  @UseGuards(AuthenticationGuard)
  async createWithdrawRequest(
    @Body() { amount, pixKey }: CreateWithDrawRequestDto,
    @Headers() { id }: AuthenticationHeadersDto,
    @Res() res: Response,
  ) {
    const userFound = await this.userService.find(
      { id },
      {
        id: true,
        email: true,
        name: true,
        cpf: true,
        password: false,
        phone: true,
        username: true,
        balance: {
          select: {
            amount: true,
          },
        },
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    );

    if (!userFound) {
      return NotFoundError;
    }

    if (amount > userFound.balance.amount) {
      return insufficientFunds(res);
    }

    const hasPixKey = [userFound.email, userFound.cpf, userFound.phone].some(
      (userPixKey) => userPixKey === pixKey,
    );

    if (!hasPixKey) {
      return badRequest(
        res,
        'The provided pix key does not bellow to logged user.',
      );
    }

    const result = await this.userService.createWithdrawRequest({
      userId: id,
      amount,
      pixKey,
    });

    return ok(res, result);
  }

  @Get('/info')
  @ApiTags('User')
  @UseGuards(AuthenticationGuard)
  async getInfos(
    @Headers() { id }: AuthenticationHeadersDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.find(
      { id },
      {
        id: true,
        email: true,
        name: true,
        cpf: true,
        password: false,
        phone: true,
        username: true,
        indicationId: true,
        balance: {
          select: {
            amount: true,
          },
        },
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    );

    if (!result) {
      return notFoundError(res, 'User not found');
    }

    return ok(res, result);
  }

  @Patch('/update/amount')
  @ApiTags('User')
  @UseGuards(AuthenticationGuard)
  async updateAmount(
    @Headers() { id }: AuthenticationHeadersDto,
    @Headers() { amount }: UpdateAmountHeaderDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.find(
      { id },
      {
        email: true,
      },
    );

    if (!result) {
      return notFoundError(res, 'User not found');
    }

    await this.userService.updateAmount(id, Number(amount));

    ok(res);
  }

  @Get('/afiliated')
  @ApiTags('User')
  @UseGuards(AuthenticationGuard)
  async countAfiliated(
    @Headers() { id }: AuthenticationHeadersDto,
    @Query() { from, to }: GetDateRangeDto,
    @Res() res: Response,
  ) {
    console.log('Endpoint /afiliated chamado com:', { userId: id, from, to });
    
    // Processa as datas apenas se forem fornecidas
    let fromDate: Date | undefined = undefined;
    let toDate: Date | undefined = undefined;
    
    if (from) {
      fromDate = new Date(from);
      if (isNaN(fromDate.getTime())) {
        return badRequest(res, 'Data inicial inválida');
      }
    }
    
    if (to) {
      toDate = new Date(to);
      if (isNaN(toDate.getTime())) {
        return badRequest(res, 'Data final inválida');
      }
    }
    
    console.log('Datas processadas:', { fromDate, toDate });
    
    const result = await this.userService.find(
      { id },
      {
        id: true,
        indicationId: true,
        name: true,
        email: true,
      },
    );

    console.log('Usuário encontrado:', result);

    if (!result) {
      return notFoundError(res, 'User not found');
    }

    if (!result.indicationId) {
      return badRequest(res, 'User does not have an indicationId');
    }

    console.log('Buscando afiliados para indicationId:', result.indicationId);
    
    const afiliatedData = await this.userService.countAfiliated(
      result.indicationId,
      fromDate,
      toDate,
    );

    console.log('Resultado final:', afiliatedData);

    return ok(res, afiliatedData);
  }

  @Get("/withdraw/requests")
  @UseGuards(AuthenticationGuard)
  @ApiTags('User')
  async getUsersWithdrawRequests(
    @Headers() { id: userId }: AuthenticationHeadersDto,
    @Query() { skip, take }: PaginatedRequestDto,
    @Res() res: Response,
  ) {

    skip = Number(skip)
    take = Number(take)
    const result = await this.userService.getUserWithDrawRequests({ userId, skip, take })

    return ok(res, result)
  }
  private isUserAlreadyFound = async (user: UserDto) => {
    const userFound = await Promise.all([
      this.userService.find(
        { email: user.email },
        {
          email: true,
        },
      ),
      this.userService.find(
        { cpf: user.cpf },
        {
          cpf: true,
        },
      ),
      this.userService.find(
        { phone: user.phone },
        {
          phone: true,
        },
      ),
    ]);

    return userFound.some((user) => user);
  };
}
