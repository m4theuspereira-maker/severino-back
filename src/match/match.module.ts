import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { PrismaService } from '../database/prisma.service';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [MatchController],
  providers: [PrismaService, MatchService],
})
export class MatchModule {}
