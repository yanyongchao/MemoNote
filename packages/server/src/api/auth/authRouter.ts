import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { authController } from "@/api/auth/authController";
import { AuthResponseSchema, LoginSchema, RegisterSchema } from "@/api/auth/authModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("AuthResponse", AuthResponseSchema);

authRegistry.registerPath({
	method: "post",
	path: "/auth/register",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: RegisterSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(AuthResponseSchema, "Created"),
});

authRouter.post("/register", validateRequest(RegisterSchema), authController.register);

authRegistry.registerPath({
	method: "post",
	path: "/auth/login",
	tags: ["Auth"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: LoginSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(AuthResponseSchema.or(z.null()), "Success"),
});

authRouter.post("/login", validateRequest(LoginSchema), authController.login);
