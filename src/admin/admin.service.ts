import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WithdrawRequest } from './dto/types';
import { $Enums } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) { }

  async getHistoryPayments(skip: number, take: number) {
    return this.prisma.payment.findMany({
      skip,
      take,
      orderBy: { updatedAt: 'asc' },
      select: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            cpf: true,
          },
        },
        qrcode: true,
        price: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getWithdrawrRequests(skip: number, take: number, cpf: string) {
    return this.prisma.withdrawRequest.findMany({
      skip,
      take,
      select: {
        id: true,
        amount: true,
        pixKey: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
            cpf: true,
            email: true,
          },
        },
      },
      where: {
        user: {
          cpf: {
            search: cpf,
          },
        },
      },
    });
  }

  async acceptWithdrawRequest({ id, userId }: WithdrawRequest, amount: number) {
    await this.updateRequest({ id, status: $Enums.PaymentStatus.PAID });

    await this.prisma.balance.update({
      where: { id: userId },
      data: { amount: { decrement: amount } },
    });
  }

  async updateRequest(withdrawRequest: WithdrawRequest) {
    await this.prisma.withdrawRequest.update({
      where: { id: withdrawRequest.id },
      data: { ...withdrawRequest },
    });
  }

  async find(withdrawRequest: WithdrawRequest) {
    return this.prisma.withdrawRequest.findFirst({
      select: {
        id: true,
        amount: true,
        pixKey: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            cpf: true,
            email: true,
            balance: {
              select: {
                id: true,
                amount: true,
              },
            },
          },
        },
      },
      where: {
        ...withdrawRequest,
        deletedAt: null,
      },
    });
  }

  async listUsers(skip: number, take: number) {
    return await this.prisma.user.findMany({
      skip: skip ?? 0,
      take: take ?? 50,
    });
  }

  async getUserByText(searchText: string) {
    return await this.prisma.$queryRaw`
    SELECT * FROM "user"
    WHERE to_tsvector("email" || ' ' || "phone" || ' ' || "username" || ' ' || "name")
    @@ plainto_tsquery(${searchText});
  `;
  }
}
