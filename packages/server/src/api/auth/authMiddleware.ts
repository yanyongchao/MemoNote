import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtVerify } from "jose";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";

type AuthenticatedUser = {
	id: number;
	email?: string;
};

declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers.authorization;
	const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;

	if (!token) {
		const serviceResponse = ServiceResponse.failure("Authentication required", null, StatusCodes.UNAUTHORIZED);
		res.status(serviceResponse.statusCode).send(serviceResponse);
		return;
	}

	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(env.USER_AUTH_TOKEN_SECRET));
		const userId = Number(payload.sub);

		if (!Number.isInteger(userId) || userId <= 0) {
			throw new Error("Invalid token subject");
		}

		req.user = {
			id: userId,
			email: typeof payload.email === "string" ? payload.email : undefined,
		};
		next();
	} catch {
		const serviceResponse = ServiceResponse.failure("Invalid or expired token", null, StatusCodes.UNAUTHORIZED);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}
};
