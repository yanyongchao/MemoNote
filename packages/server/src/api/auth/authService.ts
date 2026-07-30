import { StatusCodes } from "http-status-codes";

import type { AuthResponse, LoginInput, RegisterInput } from "@/api/auth/authModel";
import { AuthRepository } from "@/api/auth/authRepository";
import { createAuthToken, hashPassword, verifyPassword } from "@/api/auth/authSecurity";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

export class AuthService {
	private authRepository: AuthRepository;

	constructor(repository: AuthRepository = new AuthRepository()) {
		this.authRepository = repository;
	}

	async register(input: RegisterInput): Promise<ServiceResponse<AuthResponse | null>> {
		try {
			const normalizedEmail = input.email.toLowerCase();
			const existingUser = await this.authRepository.findUserByEmailAsync(normalizedEmail);

			if (existingUser) {
				return ServiceResponse.failure("Email already registered", null, StatusCodes.CONFLICT);
			}

			const user = await this.authRepository.createUserAsync({
				email: normalizedEmail,
				name: input.name ?? normalizedEmail.split("@")[0] ?? normalizedEmail,
				passwordHash: await hashPassword(input.password),
			});

			return ServiceResponse.success(
				"Registration successful",
				await this.createAuthResponse(user),
				StatusCodes.CREATED,
			);
		} catch (ex) {
			logger.error(`Error registering user: ${(ex as Error).message}`);
			return ServiceResponse.failure(
				"An error occurred while registering user.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async login(input: LoginInput): Promise<ServiceResponse<AuthResponse | null>> {
		try {
			const normalizedEmail = input.email.toLowerCase();
			const user = await this.authRepository.findUserByEmailAsync(normalizedEmail);

			if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
				return ServiceResponse.failure("Invalid email or password", null, StatusCodes.UNAUTHORIZED);
			}

			return ServiceResponse.success("Login successful", await this.createAuthResponse(user));
		} catch (ex) {
			logger.error(`Error logging in user: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while logging in.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private async createAuthResponse(user: Parameters<AuthService["toAuthUser"]>[0]): Promise<AuthResponse> {
		const authUser = this.toAuthUser(user);

		return {
			user: authUser,
			token: await createAuthToken(
				authUser.id,
				authUser.email,
				env.USER_AUTH_TOKEN_SECRET,
				env.USER_AUTH_TOKEN_EXPIRES_IN_SECONDS,
			),
		};
	}

	private toAuthUser(user: { id: number; name: string; email: string; createdAt: Date; updatedAt: Date }) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}

export const authService = new AuthService();
