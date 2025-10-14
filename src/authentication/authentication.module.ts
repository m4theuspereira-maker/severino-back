import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './guards/authenticaiton.guard';

@Module({
  exports: [AuthenticationService],
  providers: [AuthenticationService, AuthenticationGuard],
})
export class AuthenticationModule {}
