import { StatusCodes } from "http-status-codes";
import request from "supertest";

const { authResponse } = vi.hoisted(() => ({
	authResponse: {
		user: {
			id: 1,
			name: "Alice",
			email: "alice@example.com",
			createdAt: new Date("2026-07-30T00:00:00.000Z"),
			updatedAt: new Date("2026-07-30T00:00:00.000Z"),
		},
		token: "header.payload.signature",
	},
}));

vi.mock("@/api/auth/authService", () => ({
	authService: {
		register: vi.fn(async () => ({
			success: true,
			message: "Registration successful",
			responseObject: authResponse,
			statusCode: StatusCodes.CREATED,
		})),
		login: vi.fn(async () => ({
			success: true,
			message: "Login successful",
			responseObject: authResponse,
			statusCode: StatusCodes.OK,
		})),
	},
}));

import { app } from "@/server";

describe("Auth API Endpoints", () => {
	describe("POST /auth/register", () => {
		it("registers a user", async () => {
			const response = await request(app).post("/auth/register").send({
				name: "Alice",
				email: "alice@example.com",
				password: "password123",
			});

			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(response.body.success).toBeTruthy();
			expect(response.body.responseObject.user.email).toEqual("alice@example.com");
			expect(response.body.responseObject.token).toEqual("header.payload.signature");
		});

		it("validates register input", async () => {
			const response = await request(app).post("/auth/register").send({
				email: "not-an-email",
				password: "short",
			});

			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(response.body.success).toBeFalsy();
			expect(response.body.message).toContain("Invalid input");
		});
	});

	describe("POST /auth/login", () => {
		it("logs a user in", async () => {
			const response = await request(app).post("/auth/login").send({
				email: "alice@example.com",
				password: "password123",
			});

			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(response.body.success).toBeTruthy();
			expect(response.body.responseObject.user.email).toEqual("alice@example.com");
			expect(response.body.responseObject.token).toEqual("header.payload.signature");
		});

		it("validates login input", async () => {
			const response = await request(app).post("/auth/login").send({
				email: "alice@example.com",
			});

			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(response.body.success).toBeFalsy();
			expect(response.body.message).toContain("Invalid input");
		});
	});
});
