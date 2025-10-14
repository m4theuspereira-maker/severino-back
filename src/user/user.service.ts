import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from './dto/user.dtos';
import {
  CreateWithDrawRequest,
  FindUser,
  SelectUserFields,
  UpdateUser,
} from './dto/types';
import { PrismaService } from '../database/prisma.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { $Enums, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authentication: AuthenticationService,
  ) { }

  async createUser({
    username,
    name,
    email,
    cpf,
    phone,
    password,
    indicatedId,
  }: UserDto) {
    console.log('createUser chamado com:', { username, name, email, cpf, phone, indicatedId });
    
    password = await this.authentication.hashPassword(password);

    const indicationId = this.generateShortId();
    console.log('Generated indicationId:', indicationId);

    let userCreated;
    let balance;
    try {
      const userData = {
        username,
        name,
        email,
        cpf,
        phone,
        password,
        balanceId: null,
        indicationId,
        indicatedId,
        // Define a data de indicação quando houver indicatedId
        ...(indicatedId && { indicatedDate: new Date() }),
      };
      
      console.log('Dados para criar usuário:', userData);
      
      userCreated = await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          name: true,
          cpf: true,
          username: true,
          phone: true,
          balanceId: true,
          isAdmin: true,
          indicationId: true,
          indicatedId: true,
          indicatedDate: true,
          createdAt: true,
        },
      });
      
      console.log('Usuário criado:', userCreated);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      await this.prisma.user.delete({ where: { cpf } as any });
      return new InternalServerErrorException();
    }

    try {
      balance = await this.prisma.balance.create({
        data: {
          amount: 0,
          userId: userCreated.id,
        },
      });
    } catch (error) {
      await Promise.all([
        this.prisma.user.delete({ where: { cpf } } as any),
        this.prisma.balance.delete({ where: { userId: userCreated.id } }),
      ]);
      return new InternalServerErrorException();
    }

    await this.prisma.user.update({
      where: { id: userCreated.id },
      data: { balanceId: balance.id },
    });

    const token = this.authentication.encryptToken(
      email,
      password,
      userCreated.id,
      userCreated.isAdmin,
    );
    return { ...userCreated, token };
  }

  async find(user: FindUser, select: SelectUserFields) {
    return this.prisma.user.findFirst({
      where: { ...user, deletedAt: null },
      select,
    });
  }

  async update(id: number, update: UpdateUser) {
    return this.prisma.user.update({
      where: { id },
      data: { ...update, updatedAt: new Date() },
    });
  }

  async login(email: string, password: string) {
    const userFound = await this.find(
      { email },
      {
        id: true,
        email: true,
        name: true,
        cpf: true,
        password: true,
        phone: true,
        username: true,
        balance: {
          select: {
            amount: true,
          },
        },
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        indicationId: true,
      },
    );

    if (!userFound) {
      return null;
    }

    const validPaswordHashed = await this.authentication.validatePassword(
      password,
      userFound.password,
    );

    if (!validPaswordHashed) {
      return null;
    }

    const token = this.authentication.encryptToken(
      email,
      password,
      userFound.id,
      userFound.isAdmin,
    );

    return {
      id: userFound.id,
      email,
      token,
      phone: userFound.phone,
      balance: userFound.balance?.amount ?? 0,
      name: userFound.name,
      cpf: userFound.cpf,
      username: userFound.username,
      indicationId: userFound.indicationId,
    };
  }

  async resetPassword(email: string, oldPassword: string, newPassword: string) {
    const userFound = await this.find(
      { email },
      {
        id: true,
        email: true,
        name: true,
        cpf: true,
        password: true,
        phone: true,
        username: true,
        balance: {
          select: {
            amount: true,
          },
        },
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    );

    if (!userFound) {
      return null;
    }

    const validPasword = await this.authentication.validatePassword(
      oldPassword,
      userFound.password!,
    );

    if (!validPasword) {
      return null;
    }

    const newPasswordHashed =
      await this.authentication.hashPassword(newPassword);

    const userUpdated = await this.update(userFound.id!, {
      password: newPasswordHashed,
    });

    if (!userUpdated) {
      return null;
    }

    const token = this.authentication.encryptToken(
      email,
      newPassword,
      userFound.id,
      userFound.isAdmin,
    );

    return {
      id: userUpdated.id,
      email: userUpdated.email,
      token,
      createdAt: userUpdated.createdAt,
      updatedAt: userUpdated.updatedAt,
    };
  }

  async createWithdrawRequest({
    userId,
    amount,
    pixKey,
  }: CreateWithDrawRequest) {
    return this.prisma.withdrawRequest.create({
      data: { userId, amount, pixKey, status: $Enums.PaymentStatus.PENDING },
    });
  }

  private generateShortId() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    return (
      ('000' + firstPart.toString(36)).slice(-3) +
      ('000' + secondPart.toString(36)).slice(-3)
    );
  }

  async updateAmount(id: number, amount: number) {
    await this.prisma.balance.update({
      where: { userId: id },
      data: {
        amount: {
          increment: amount,
        },
      },
    });
  }

  validateCpf(cpf: string) {
    console.log('Validando CPF:', cpf);
    
    // Remove formatação (pontos e traços)
    cpf = cpf.replace(/[^\d]+/g, '');
    console.log('CPF limpo:', cpf);

    if (cpf.length !== 11) {
      console.log('CPF inválido: não tem 11 dígitos');
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      console.log('CPF inválido: todos os dígitos são iguais');
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto === 10 || resto === 11 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto === 10 || resto === 11 ? 0 : resto;

    const isValid = (
      digito1 === parseInt(cpf.charAt(9)) &&
      digito2 === parseInt(cpf.charAt(10))
    );
    
    console.log('CPF válido:', isValid, 'Dígitos calculados:', { digito1, digito2, 'digito1_cpf': cpf.charAt(9), 'digito2_cpf': cpf.charAt(10) });
    return isValid;
  }

  async getUserWithDrawRequests({ userId, skip, take }: { userId: number, skip: number, take: number }) {
    return await this.prisma.withdrawRequest.findMany({ where: { userId }, skip: skip ?? 0, take })
  }

  async countAfiliated(indicatedId: string, from?: Date, to?: Date) {
    console.log('countAfiliated chamado com:', { indicatedId, from, to });
    
    // Se não houver datas, busca todos os usuários indicados
    let whereClause: any = {
      indicatedId,
    };

    // Se houver datas, adiciona filtro de data
    if (from || to) {
      const gte = from || new Date(new Date().setDate(new Date().getDate() - 30)); // Últimos 30 dias se não houver data inicial
      const lt = to || new Date();
      
      console.log('Datas de busca:', { gte, lt });
      
      whereClause.indicatedDate = {
        gte,
        lt,
      };
    }

    console.log('Where clause:', whereClause);

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        cpf: true,
        phone: true,
        indicatedDate: true,
        createdAt: true,
      },
      orderBy: {
        indicatedDate: 'desc',
      },
    });

    console.log('Usuários encontrados:', users);

    // Contador total
    const totalCount = users.length;

    // Agrupamento por data
    const groupedData = users.reduce((acc, item) => {
      const dateKey = this.formatDateToDDMM(item.indicatedDate);
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, count: 0, users: [] };
      }
      acc[dateKey].count += 1;
      acc[dateKey].users.push({
        id: item.id,
        name: item.name,
        email: item.email,
        username: item.username,
        cpf: item.cpf,
        phone: item.phone,
        indicatedDate: item.indicatedDate,
        createdAt: item.createdAt,
      });
      return acc;
    }, {});

    const result = {
      totalCount,
      users,
      groupedByDate: Object.values(groupedData),
    };
    
    console.log('Resultado final:', result);
    
    return result;
  }

  private formatDateToDDMM(dateStr: Date) {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }
}
