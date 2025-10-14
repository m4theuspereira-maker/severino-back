import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';
import { AuthenticationGuard } from '../authentication/guards/authenticaiton.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [PrismaService, AuthenticationGuard, AdminService],
})
export class AdminModule {}
