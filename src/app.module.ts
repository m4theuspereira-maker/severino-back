import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyAuthenticationGuard } from './authentication/guards/authenticaiton.guard';
import { MatchModule } from './match/match.module';

@Module({
  imports: [UserModule, PaymentModule, AdminModule, MatchModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyAuthenticationGuard,
    },
  ],
})
export class AppModule {}
