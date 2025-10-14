import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);
    let user = await prisma.user.findFirst({ where: { email: 'admin@admin.com' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'admin@admin.com',
                password,
                name: 'Administrador',
                cpf: '12345678900',
                phone: '11999999999',
                isAdmin: true,
                username: 'admin',
            },
        });
        console.log('Usuário admin criado:', user);
    } else {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password,
                isAdmin: true,
                name: 'Administrador',
                cpf: '12345678900',
                phone: '11999999999',
                username: 'admin',
            },
        });
        console.log('Usuário admin atualizado:', user.email);
    }

    // Garante que o balance existe
    let balance = await prisma.balance.findUnique({ where: { userId: user.id } });
    if (!balance) {
        balance = await prisma.balance.create({
            data: {
                userId: user.id,
                amount: 10000, // valor inicial
            },
        });
        await prisma.user.update({
            where: { id: user.id },
            data: { balanceId: balance.id },
        });
        console.log('Balance criado para admin:', balance);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });