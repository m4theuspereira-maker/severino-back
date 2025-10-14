import { $Enums, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateMatch } from './dto/types';
import { match } from 'assert';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchService {
  constructor(private readonly prismaService: PrismaService) { }

  async createMatch({ betValue, songId, userId, message }: CreateMatch) {
    return this.prismaService.$transaction(async (prisma) => {
      const match = await prisma.match.create({
        data: {
          betValue,
          songId,
          status: $Enums.MatchStatus.STARTED,
          userId,
          message,
        },
      });

      await prisma.matchHistory.create({
        data: {
          userId,
          matchId: match.id,
        },
      });

      return match;
    });
  }

  async updateMatchStatus(
    id: number,
    data: { status: $Enums.MatchStatus; message: string },
  ) {
    return await this.prismaService.match.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async findMatch(id: number) {
    return await this.prismaService.match.findFirst({ where: { id } });
  }

  async findLastMatch(userId: number) {
    return await this.prismaService.matchHistory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        matchId: true,
        match: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getMatchHistory({
    userId,
    take,
    skip,
  }: {
    userId: number;
    take: number;
    skip: number;
  }) {
    return await this.prismaService.matchHistory.findMany({
      where: {
        userId,
      },
      skip: skip ?? 0,
      take,
      select: {
        match: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
