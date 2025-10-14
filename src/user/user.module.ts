import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
