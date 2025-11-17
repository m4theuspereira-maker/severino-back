// src/common/enums/operator-class.enum.ts

// Este enum replica o tipo do Prisma para ser usado com o class-validator no TypeScript/Windows.
export enum OperatorClass {
  FUZILEIRO = 'FUZILEIRO',
  SUPORTE = 'SUPORTE',
  SNIPER = 'SNIPER',
  DMR = 'DMR',
  MEDIC = 'MEDIC', // Se você adicionou MEDICO, ajuste aqui
  RECON = 'RECON', // Se você adicionou RECON, ajuste aqui
  // Adicione todos os membros do seu enum OperatorClass que estão no schema.prisma
}