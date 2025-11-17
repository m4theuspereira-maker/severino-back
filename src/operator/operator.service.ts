
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateOperatorDto } from "./dto/operator.dto";
import { UpdateOperator } from "./dto/types";
import { connect } from "http2";

@Injectable()

export class OperatorService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, data: CreateOperatorDto) {
        const existingOperator = await this.prisma.operator.findUnique({
            where: { userId },
        });
        
        if (existingOperator) {
            throw new Error('Este usuário já possui um perfil de Operador.');
        }

        const newOperator = await this.prisma.operator.create({
            data: {
                class: data.class,
                isFirstTIme: data.isFirstTime,
                participationDays: data.participationDays,
                coments: data.comments,
                teamId: data.teamId,
                user: {
                    connect: { id: userId },
                },
            },

            include: {
                user: true,
                team: true,
            },
        });

        return newOperator;
    };

    async findOne(userId: number, data: UpdateOperator) {}
}