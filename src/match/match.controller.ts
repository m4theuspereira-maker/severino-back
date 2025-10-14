import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Headers,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../authentication/guards/authenticaiton.guard';
import { Response } from 'express';
import { AuthenticationHeadersDto } from '../payment/dto/payment.dto';
import { PrismaService } from '../database/prisma.service';
import {
  insufficientFunds,
  notFoundError,
  ok,
  badRequest,
} from 'src/@handlers/handlers';
import { AuthenticationService } from '../authentication/authentication.service';
import {
  CreateMatchDto,
  PaginatedRequestDto,
  UpdateMachDto,
} from './dto/match.dto';
import { API_KEY, REDIRECT_URL } from '../@common/environment-contants';
import { $Enums } from '@prisma/client';

@Controller('/match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly prismaService: PrismaService,
  ) { }

  @ApiTags('Match')
  @Post('/create')
  @UseGuards(AuthenticationGuard)
  async createMatch(
    @Headers() { id: userId }: AuthenticationHeadersDto,
    @Body() { betValue, songId }: CreateMatchDto,
    @Res() res: Response,
  ) {
    const userFound = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!userFound) {
      return notFoundError(res, 'User not found');
    }

    const balance = await this.prismaService.balance.findFirst({
      where: { userId },
    });

    if (balance.amount - betValue < 0) {
      return insufficientFunds(res, 'insuficient funds');
    }

    const lastMatch = (await this.matchService.findLastMatch(userId)).at(0);

    if (
      lastMatch &&
      lastMatch.match.status != $Enums.MatchStatus.ERROR &&
      lastMatch.match.status != $Enums.MatchStatus.DISCONNECTED
    ) {
      await this.matchService.updateMatchStatus(lastMatch.matchId, {
        status: $Enums.MatchStatus.ERROR,
        message: 'Match error because other match as started before its ends',
      });
    }

    await this.prismaService.balance.update({
      where: {
        id: balance.id,
      },
      data: {
        amount: {
          decrement: betValue,
        },
      },
    });

    const match = await this.matchService.createMatch({
      betValue,
      songId,
      userId,
      message: 'match started',
    });

    const data = `matchId=${match.id}&betValue=${betValue}&songId=${songId}&userId=${userId}`;

    const encryptedData = AuthenticationService.encrypt(data);

    return ok(res, { gameUrl: `${REDIRECT_URL}/${encryptedData}` });
  }
  @ApiTags('Match')
  @Put('/update')
  async updateMatchStatus(
    @Body()
    {
      userId,
      betValue,
      matchId,
      status,
      message,
      apiKey,
      money,
    }: UpdateMachDto,
    @Res() res: Response,
  ) {
    if (!this.verifyPrivateKey(apiKey)) {
      return badRequest(res, 'unauthorized');
    }

    matchId = Number(matchId);
    userId = Number(userId);
    betValue = Number(betValue);
    const match = await this.prismaService.match.findFirst({
      where: {
        id: matchId,
      },
    });

    if (!match) {
      return notFoundError(res, 'Match not found');
    }

    if (status.toUpperCase() === $Enums.MatchStatus.ERROR) {
      await this.matchService.updateMatchStatus(matchId, {
        status,
        message: message,
      });
      return ok(res);
    }
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    const balance = await this.prismaService.balance.findFirst({
      where: { id: user.balanceId },
    });

    if (!balance || !user) {
      return notFoundError(res, 'user or balance not found');
    }

    if (money < 1) {
      return ok(res);
    }

    await this.prismaService.balance.update({
      where: { id: user.balanceId },
      data: {
        amount: {
          increment: betValue + money,
        },
        updatedAt: new Date(),
      },
    });

    await this.matchService.updateMatchStatus(matchId, { status, message });
    return ok(res);
  }

  @ApiTags('Match')
  @Get('/history')
  @UseGuards(AuthenticationGuard)
  async getMatchHistory(
    @Headers() { id: userId }: AuthenticationHeadersDto,
    @Query() { skip, take }: PaginatedRequestDto,
    @Res() res: Response,
  ) {
    skip = Number(skip);
    take = Number(take);

    const result = await this.matchService.getMatchHistory({
      userId,
      skip,
      take,
    });

    return ok(res, result);
  }

  private verifyPrivateKey(apiKeyEncrypted: string) {
    return AuthenticationService.decrypt(apiKeyEncrypted) === API_KEY;
  }
}
