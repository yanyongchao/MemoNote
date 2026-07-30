import { StatusCodes } from "http-status-codes";
import { jwtVerify } from "jose";
import type { Mock } from "vitest";

import { AuthRepository } from "@/api/auth/authRepository";
import { hashPassword } from "@/api/auth/authSecurity";
import { AuthService } from "@/api/auth/authService";

vi.mock("@/api/auth/authRepository");

describe("authService", () => {
	let authServiceInstance: AuthService;
	let authRepositoryInstance: AuthRepository;

	const mockUser = {
		id: 1,
		name: "Alice",
		email: "alice@example.com",
		passwordHash: "",
		createdAt: new Date("2026-07-30T00:00:00.000Z"),
		updatedAt: new Date("2026-07-30T00:00:00.000Z"),
	};

	beforeEach(() => {
		authRepositoryInstance = new AuthRepository();
		authServiceInstance = new AuthService(authRepositoryInstance);
	});

	describe("register", () => {
		it("creates a new user and returns a token", async () => {
			(authRepositoryInstance.findUserByEmailAsync as Mock).mockResolvedValue(null);
			(authRepositoryInstance.createUserAsync as Mock).mockImplementation(async (input) => ({
				...mockUser,
				...input,
			}));

			const result = await authServiceInstance.register({
				name: "Alice",
				email: "ALICE@example.com",
				password: "password123",
			});

			expect(result.statusCode).toEqual(StatusCodes.CREATED);
			expect(result.success).toBeTruthy();
			expect(result.data?.user.email).toEqual("alice@example.com");
			expect(result.data?.user.name).toEqual("Alice");
			expect(result.data?.token.split(".")).toHaveLength(3);
			await expectValidToken(result.data?.token as string, "1", "alice@example.com");
			expect(authRepositoryInstance.createUserAsync).toHaveBeenCalledWith(
				expect.objectContaining({ email: "alice@example.com", name: "Alice" }),
			);
			expect(authRepositoryInstance.createUserAsync).toHaveBeenCalledWith(
				expect.objectContaining({ passwordHash: expect.stringMatching(/^scrypt:/) }),
			);
		});

		it("returns conflict when email already exists", async () => {
			(authRepositoryInstance.findUserByEmailAsync as Mock).mockResolvedValue(mockUser);

			const result = await authServiceInstance.register({
				email: "alice@example.com",
				password: "password123",
			});

			expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual("Email already registered");
			expect(authRepositoryInstance.createUserAsync).not.toHaveBeenCalled();
		});
	});

	describe("login", () => {
		it("returns a token for valid credentials", async () => {
			(authRepositoryInstance.findUserByEmailAsync as Mock).mockResolvedValue({
				...mockUser,
				passwordHash: await hashPassword("password123"),
			});

			const result = await authServiceInstance.login({
				email: "ALICE@example.com",
				password: "password123",
			});

			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual("Login successful");
			expect(result.data?.user.email).toEqual("alice@example.com");
			expect(result.data?.token.split(".")).toHaveLength(3);
			await expectValidToken(result.data?.token as string, "1", "alice@example.com");
		});

		it("returns unauthorized for invalid password", async () => {
			(authRepositoryInstance.findUserByEmailAsync as Mock).mockResolvedValue({
				...mockUser,
				passwordHash: await hashPassword("password123"),
			});

			const result = await authServiceInstance.login({
				email: "alice@example.com",
				password: "wrong-password",
			});

			expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual("Invalid email or password");
			expect(result.data).toBeNull();
		});
	});
});

async function expectValidToken(token: string, subject: string, email: string) {
	const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.USER_AUTH_TOKEN_SECRET));

	expect(payload.sub).toEqual(subject);
	expect(payload.email).toEqual(email);
}
