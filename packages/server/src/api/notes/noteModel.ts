import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const NoteSchema = z.object({
	id: z.number(),
	title: z.string(),
	content: z.string(),
	isPinned: z.boolean(),
	isFavorite: z.boolean(),
	userId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const noteBodySchema = z.object({
	title: z.string().trim().min(1, "Title is required").max(120),
	content: z.string().trim().max(10000).default(""),
});

export const ListNotesSchema = z.object({
	query: z.object({
		q: z.string().trim().optional(),
		favorite: z.enum(["true", "false"]).optional(),
	}),
});

export const GetNoteSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});

export const CreateNoteSchema = z.object({
	body: noteBodySchema,
});

export const UpdateNoteSchema = z.object({
	params: z.object({ id: commonValidations.id }),
	body: noteBodySchema.partial().refine((body) => Object.keys(body).length > 0, "At least one field is required"),
});

export const PatchNoteStateSchema = z.object({
	params: z.object({ id: commonValidations.id }),
	body: z
		.object({
			isPinned: z.boolean().optional(),
			isFavorite: z.boolean().optional(),
		})
		.refine((body) => Object.keys(body).length > 0, "At least one field is required"),
});

export type Note = z.infer<typeof NoteSchema>;
export type ListNotesQuery = z.infer<typeof ListNotesSchema>["query"];
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>["body"];
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>["body"];
export type PatchNoteStateInput = z.infer<typeof PatchNoteStateSchema>["body"];
