import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      console.warn(">>> WARNING: DATABASE_URL is not set. Prisma operations will fail.");
    }
    prismaInstance = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  return prismaInstance;
};

// Export for compatibility if needed, but getPrisma() is preferred
export const prisma = getPrisma();
