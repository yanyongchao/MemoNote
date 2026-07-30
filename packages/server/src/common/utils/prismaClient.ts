import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "@/common/utils/envConfig";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaMariaDb(env.DATABASE_URL);

export const prisma = new PrismaClient({ adapter });
