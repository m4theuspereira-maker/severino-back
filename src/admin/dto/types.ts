import { $Enums } from '@prisma/client';

export type WithdrawRequest = {
  id?: number;
  userId?: number;
  pixKey?: string;
  status?: $Enums.PaymentStatus;
};
