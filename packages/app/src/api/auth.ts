import { http } from "@/libs/http";

export type AuthUser = {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

export type AuthResponse = {
	user: AuthUser;
	token: string;
};

export type RegisterInput = {
	name?: string;
	email: string;
	password: string;
};

export type LoginInput = {
	email: string;
	password: string;
};

export async function register(input: RegisterInput) {
	return http.post<AuthResponse>("/auth/register", input);
}

export async function login(input: LoginInput) {
	return http.post<AuthResponse>("/auth/login", input);
}
