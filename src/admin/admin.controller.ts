import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Headers,
  Query,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { insufficientFunds, notFoundError, ok } from '../@handlers/handlers';
import { ApiTags } from '@nestjs/swagger';
import {
  AdminAuthenticationGuard,
  AuthenticationGuard,
} from '../authentication/guards/authenticaiton.guard';
import {
  AuthenticationHeadersDto,
  PaginationDto,
} from '../payment/dto/payment.dto';
import {
  AcceptWithdrawRequestDto,
  GetPaymentDataDto,
  GetUserByTextDto,
  GetWithdrawRequestsDto,
} from './dto/admin.dto';
import { $Enums } from '@prisma/client';
import { Public } from '../@decorators/public';
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/payments')
  @ApiTags('admin')
  @UseGuards(AdminAuthenticationGuard)
  async getHistoryPayments(
    @Headers() _headers: AuthenticationHeadersDto,
    @Query() { skip, take }: GetPaymentDataDto,
    @Res() res: Response,
  ) {
    const result = await this.adminService.getHistoryPayments(
      Number(skip),
      Number(take),
    );

    return ok(res, result);
  }
  @Get('/withdrawRequests')
  @ApiTags('Payment')
  @UseGuards(AuthenticationGuard)
  async getWithdrawRequests(
    @Headers() _headers: AuthenticationHeadersDto,
    @Query() { skip, take, cpf }: GetWithdrawRequestsDto,
    @Res() res: Response,
  ) {
    const result = await this.adminService.getWithdrawrRequests(
      Number(skip),
      Number(take),
      cpf,
    );

    return ok(res, result);
  }

  @Patch('/withdrawRequest/accept/:id')
  @ApiTags('admin')
  @UseGuards(AdminAuthenticationGuard)
  async acceptWithdrawRequest(
    @Headers() _headers: AuthenticationHeadersDto,
    @Param() { id }: AcceptWithdrawRequestDto,
    @Res() res: Response,
  ) {
    id = Number(id);
    const withdrawRequest = await this.adminService.find({
      id,
    });

    if (!withdrawRequest) {
      return notFoundError(res, 'Withdraw request not found');
    }

    const {
      user: {
        id: userId,
        balance: { amount: balanceAmount },
      },
      amount: withdrawRequestAmount,
    } = withdrawRequest;

    if (balanceAmount < withdrawRequestAmount) {
      await this.adminService.updateRequest({
        id,
        status: $Enums.PaymentStatus.INSUFFICIENT_FUNDS,
      });
      return insufficientFunds(res);
    }

    await this.adminService.acceptWithdrawRequest(
      { userId, id },
      withdrawRequestAmount,
    );

    return ok(res);
  }

  @Get('/list/users')
  @ApiTags('admin')
  @UseGuards(AdminAuthenticationGuard)
  async listUsers(
    @Headers() _headers: AuthenticationHeadersDto,
    @Query() { skip, take }: PaginationDto,
    @Res() res: Response,
  ) {
    const users = await this.adminService.listUsers(skip, take);

    return ok(res, users);
  }

  @ApiTags('admin')
  @Get('serverTime')
  @Public()
  serverTime() {
    return Math.floor(Date.now() / 1000);
  }

  @Get('/user/text')
  @ApiTags('admin')
  @UseGuards(AdminAuthenticationGuard)
  async getUserBySearch(
    @Headers() _headers: AuthenticationHeadersDto,
    @Query() { search }: GetUserByTextDto,
    @Res() res: Response,
  ) {
    const result = await this.adminService.getUserByText(
      search
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim(),
    );
    return ok(res, result);
  }
}
