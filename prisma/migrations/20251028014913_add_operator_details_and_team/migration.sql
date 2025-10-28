-- CreateEnum
CREATE TYPE "OperatorClass" AS ENUM ('FUZILEIRO', 'SUPORTE', 'SNIPER', 'DMR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateTable
CREATE TABLE "Operator" (
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER,
    "class" "OperatorClass" NOT NULL DEFAULT 'FUZILEIRO',
    "isFirstTime" BOOLEAN NOT NULL DEFAULT true,
    "participationDays" TEXT[],
    "comments" TEXT,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "foundationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_userId_key" ON "Operator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
