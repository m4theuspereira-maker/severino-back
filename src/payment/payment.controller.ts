import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticationHeadersDto,
  GeneratePaymentDto,
  GetTransactionStatusDto,
} from './dto/payment.dto';
import { Response } from 'express';
import { AuthenticationGuard } from '../authentication/guards/authenticaiton.guard';
import { ok } from '../@handlers/handlers';
import { PaymentWebhookDto } from './dto/types';
import { Public } from 'src/@decorators/public';

@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/generate/pix')
  @UseGuards(AuthenticationGuard)
  @ApiTags('Payment')
  async generatePayment(
    @Body() { name, email, cpf, price }: GeneratePaymentDto,
    @Headers() { id }: AuthenticationHeadersDto,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.generatePayment({
      id,
      name,
      email,
      cpf,
      price,
    });

    return ok(res, result);
  }

  @Post('/updateStatus/agilizepay')
  @Public()
  @ApiTags('Payment')
  async updatePaymentStatusWebhook(
    @Body() { idTransaction, statusTransaction }: PaymentWebhookDto,
    @Res() res: Response,
  ) {
    await this.paymentService.updatePaymentStatus(
      idTransaction,
      statusTransaction,
    );

    return ok(res);
  }

  @Get('/transactionStatus/agilizepay/:transactionId')
  @ApiTags('Payment')
  async getTransactionStatusZoldpay(
    @Param() { transactionId }: GetTransactionStatusDto,
    @Res() res: Response,
  ) {
    const result =
      await this.paymentService.getAgilizePayTransaction(transactionId);

    return ok(res, result);
  }
}
