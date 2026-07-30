import type { User } from "@/api/user/userModel";
import { prisma } from "@/common/utils/prismaClient";

type UserWithPasswordHash = User & {
	passwordHash: string;
};

type CreateUserInput = {
	email: string;
	name: string;
	passwordHash: string;
};

export class AuthRepository {
	async findUserByEmailAsync(email: string): Promise<UserWithPasswordHash | null> {
		return prisma.user.findUnique({ where: { email } });
	}

	async createUserAsync(input: CreateUserInput): Promise<UserWithPasswordHash> {
		return prisma.user.create({ data: input });
	}
}
