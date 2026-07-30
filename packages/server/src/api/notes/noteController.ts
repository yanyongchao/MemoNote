import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { noteService } from "@/api/notes/noteService";
import { ServiceResponse } from "@/common/models/serviceResponse";

function getUserId(req: Request): number | null {
	return req.user?.id ?? null;
}

class NoteController {
	public getNotes: RequestHandler = async (req: Request, res: Response) => {
		const userId = getUserId(req);

		if (!userId) {
			const response = ServiceResponse.failure("Authentication required", null, StatusCodes.UNAUTHORIZED);
			res.status(response.statusCode).send(response);
			return;
		}

		const serviceResponse = await noteService.findAll(userId, req.query as { q?: string; favorite?: "true" | "false" });
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getNote: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.findById(getUserId(req) as number, Number(req.params.id));
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createNote: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.create(getUserId(req) as number, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateNote: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.update(getUserId(req) as number, Number(req.params.id), req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public patchNoteState: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.patchState(getUserId(req) as number, Number(req.params.id), req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteNote: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.delete(getUserId(req) as number, Number(req.params.id));
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getStats: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await noteService.stats(getUserId(req) as number);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const noteController = new NoteController();
