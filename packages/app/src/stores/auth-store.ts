import { create } from "zustand";

import * as authApi from "@/api/auth";
import { TOKEN_KEY } from "@/constants/auth";
import { storage } from "@/libs/storage";

const USER_KEY = "memonote_user";

type AuthState = {
	token?: string;
	user?: authApi.AuthUser;
	isAuthenticated: boolean;
	login: (input: authApi.LoginInput) => Promise<authApi.AuthResponse>;
	register: (input: authApi.RegisterInput) => Promise<authApi.AuthResponse>;
	logout: () => void;
	hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	token: storage.getItem<string>(TOKEN_KEY),
	user: storage.getItem<authApi.AuthUser>(USER_KEY),
	isAuthenticated: Boolean(storage.getItem<string>(TOKEN_KEY)),

	login: async (input) => {
		const auth = await authApi.login(input);
		persistAuth(auth);
		set({ token: auth.token, user: auth.user, isAuthenticated: true });
		return auth;
	},

	register: async (input) => {
		const auth = await authApi.register(input);
		persistAuth(auth);
		set({ token: auth.token, user: auth.user, isAuthenticated: true });
		return auth;
	},

	logout: () => {
		storage.removeItem(TOKEN_KEY);
		storage.removeItem(USER_KEY);
		set({ token: undefined, user: undefined, isAuthenticated: false });
	},

	hydrate: () => {
		const token = storage.getItem<string>(TOKEN_KEY);
		set({
			token,
			user: storage.getItem<authApi.AuthUser>(USER_KEY),
			isAuthenticated: Boolean(token),
		});
	},
}));

function persistAuth(auth: authApi.AuthResponse) {
	storage.setItem(TOKEN_KEY, auth.token);
	storage.setItem(USER_KEY, auth.user);
}
