import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTransaction } from './dto/types';
import {
  createAgilizePaytransaction,
  createTransactionZoldPay,
  getAgilizePayTransaction,
  getTransactionStatus,
} from './intergrations/integrations';
import { $Enums } from '@prisma/client';
import { AGILIZE_PAY_POSTBACK, ZOLDPAY_PAID_STATUS } from 'src/@common/environment-contants';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) { }

  async generatePayment({ name, cpf, email, price, id }: CreateTransaction) {
    const userfound = await this.prisma.user.findFirst({ where: { id } });

    if (!userfound) {
      return null;
    }

    const result = await createAgilizePaytransaction({
      code: 'string',
      document:cpf,
      email,
      amount:price,
      url: AGILIZE_PAY_POSTBACK
    });

    const { txid:transactionId, qrCode: qrcode } = result;

    await this.prisma.payment.create({
      data: {
        transactionId,
        qrcode,
        price,
        status: $Enums.PaymentStatus.PENDING,
        userId: userfound.id,
        balanceId: userfound.balanceId,
      },
    });
    return { transactionId, qrcode, status: $Enums.PaymentStatus.PENDING };
  }

  async updatePaymentStatus(transactionId: string, webhookStatus: string) {
    const paymentFound = await this.prisma.payment.findFirst({
      where: { transactionId },
    });

    if (paymentFound && webhookStatus.toUpperCase() === 'SUCESSO') {
      await this.payUserWhoIndicated(paymentFound.userId);

      await this.prisma.payment.update({
        where: { id: paymentFound.id },
        data: { status: $Enums.PaymentStatus.PAID, updatedAt: new Date() },
      });

      if (paymentFound.status === $Enums.PaymentStatus.PENDING) {
        await this.prisma.balance.update({
          where: { userId: paymentFound.userId },
          data: {
            amount: {
              increment: paymentFound.price,
            },
          },
        });
      }
    }
  }

  async payUserWhoIndicated(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user.indicatedId) {
      return;
    }

    const userWhoIndicated = await this.prisma.user.findFirst({
      where: { indicationId: user.indicatedId, deletedAt: null },
    });

    const finalizedPayments = await this.prisma.payment.count({
      where: { userId: user.id, status: $Enums.PaymentStatus.PAID },
    });

    if (userWhoIndicated.isInfluencer) {
      await this.prisma.balance.update({
        where: {
          userId: userWhoIndicated.id,
        },
        data: {
          amount: {
            increment: 1000,
          },
        },
      });

      return;
    }

    if (finalizedPayments < 1) {
      await this.prisma.balance.update({
        where: {
          userId: userWhoIndicated.id,
        },
        data: {
          amount: {
            increment: 1000,
          },
        },
      });
    }
  }

  async getPaymentStatusZoldPay(transactionId: string) {
    return await getTransactionStatus(transactionId);
  }

  async getAgilizePayTransaction(transactionId: string) {
    return await getAgilizePayTransaction(transactionId)
  }
}
