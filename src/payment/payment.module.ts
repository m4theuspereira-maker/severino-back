import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../database/prisma.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
