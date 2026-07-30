import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
