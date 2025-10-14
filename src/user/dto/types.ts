export type FindUser = {
  id?: number;
  username?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  indicationId?: string;
  shortId?: string;
};

export type UpdateUser = {
  id?: number;
  email?: string;
  password?: string;
  name?: string;
  cpf?: string;
  balanceId?: number;
  phone?: string;
  username?: string;
};

export type ShortUrl = {
  id?: string;
  shortId?: string;
  userId?: string;
  totalVisits?: number;
  lastVisit?: Date;
  redirectUrl?: string;
  deletedAt?: Date;
};

export type User = {
  email?: string;
  id?: string;
};

export type CreateWithDrawRequest = {
  userId?: number;
  amount: number;
  pixKey: string;
};

export type SelectUserFields = {
  id?: boolean;
  email?: boolean;
  name?: boolean;
  cpf?: boolean;
  password?: boolean;
  phone?: boolean;
  username?: boolean;
  balance?: {
    select?: {
      amount?: boolean;
    };
  };
  isAdmin?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  indicationId?: boolean;
};
