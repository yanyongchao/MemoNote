import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { UserSchema } from "@/api/user/userModel";

extendZodWithOpenApi(z);

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const RegisterSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: passwordSchema,
		name: z.string().min(1).max(100).optional(),
	}),
});

export const LoginSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(1, "Password is required"),
	}),
});

export const AuthUserSchema = UserSchema;

export const AuthResponseSchema = z.object({
	user: AuthUserSchema,
	token: z.string(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>["body"];
export type LoginInput = z.infer<typeof LoginSchema>["body"];
