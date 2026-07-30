import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
import { z } from "zod";
import { PrismaClient } from "../src/generated/prisma/client";
import { mockUsers } from "./seedData";

const nodeEnv = process.env.NODE_ENV ?? "development";

dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

const seedEnv = z
	.object({
		DATABASE_URL: z.string().url(),
	})
	.parse(process.env);

const adapter = new PrismaMariaDb(seedEnv.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
	for (const user of mockUsers) {
		await prisma.user.upsert({
			where: { email: user.email },
			update: {
				name: user.name,
				age: user.age,
			},
			create: {
				name: user.name,
				email: user.email,
				age: user.age,
			},
		});
	}
}

main()
	.finally(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		process.exit(1);
	});
