import { PrismaClient } from "@prisma/client";
import prismaRandom from "prisma-extension-random";

const prismaClientSingleton = () => {
    return new PrismaClient().$extends(prismaRandom());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const db = globalForPrisma.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
