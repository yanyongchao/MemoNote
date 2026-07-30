import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { authenticate } from "@/api/auth/authMiddleware";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { noteController } from "./noteController";
import {
	CreateNoteSchema,
	GetNoteSchema,
	ListNotesSchema,
	NoteSchema,
	PatchNoteStateSchema,
	UpdateNoteSchema,
} from "./noteModel";

export const noteRegistry = new OpenAPIRegistry();
export const noteRouter: Router = express.Router();

noteRegistry.register("Note", NoteSchema);

noteRouter.use(authenticate);

noteRouter.get("/", validateRequest(ListNotesSchema), noteController.getNotes);
noteRouter.get("/stats", noteController.getStats);
noteRouter.get("/:id", validateRequest(GetNoteSchema), noteController.getNote);
noteRouter.post("/", validateRequest(CreateNoteSchema), noteController.createNote);
noteRouter.put("/:id", validateRequest(UpdateNoteSchema), noteController.updateNote);
noteRouter.patch("/:id", validateRequest(PatchNoteStateSchema), noteController.patchNoteState);
noteRouter.delete("/:id", validateRequest(GetNoteSchema), noteController.deleteNote);

noteRegistry.registerPath({
	method: "get",
	path: "/notes",
	tags: ["Notes"],
	request: { query: ListNotesSchema.shape.query },
	responses: createApiResponse(z.array(NoteSchema), "Success"),
});

noteRegistry.registerPath({
	method: "get",
	path: "/notes/{id}",
	tags: ["Notes"],
	request: { params: GetNoteSchema.shape.params },
	responses: createApiResponse(NoteSchema, "Success"),
});

noteRegistry.registerPath({
	method: "post",
	path: "/notes",
	tags: ["Notes"],
	request: { body: { content: { "application/json": { schema: CreateNoteSchema.shape.body } } } },
	responses: createApiResponse(NoteSchema, "Created"),
});
