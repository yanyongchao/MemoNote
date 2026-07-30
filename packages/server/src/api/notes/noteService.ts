import { StatusCodes } from "http-status-codes";

import type { CreateNoteInput, ListNotesQuery, PatchNoteStateInput, UpdateNoteInput } from "@/api/notes/noteModel";
import { NoteRepository } from "@/api/notes/noteRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

type NoteData = Awaited<ReturnType<NoteRepository["createAsync"]>>;

export class NoteService {
	private noteRepository: NoteRepository;

	constructor(repository: NoteRepository = new NoteRepository()) {
		this.noteRepository = repository;
	}

	async findAll(userId: number, query: ListNotesQuery): Promise<ServiceResponse<NoteData[]>> {
		try {
			const notes = await this.noteRepository.findManyByUserAsync(userId, {
				q: query.q,
				favorite: query.favorite === undefined ? undefined : query.favorite === "true",
			});
			return ServiceResponse.success("Notes found", notes);
		} catch (ex) {
			logger.error(`Error finding notes: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while finding notes.", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async findById(userId: number, id: number): Promise<ServiceResponse<NoteData | null>> {
		try {
			const note = await this.noteRepository.findByIdForUserAsync(id, userId);

			if (!note) {
				return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Note found", note);
		} catch (ex) {
			logger.error(`Error finding note: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while finding note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async create(userId: number, input: CreateNoteInput): Promise<ServiceResponse<NoteData | null>> {
		try {
			const note = await this.noteRepository.createAsync(userId, input);
			return ServiceResponse.success("Note created", note, StatusCodes.CREATED);
		} catch (ex) {
			logger.error(`Error creating note: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while creating note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async update(userId: number, id: number, input: UpdateNoteInput): Promise<ServiceResponse<NoteData | null>> {
		try {
			const note = await this.noteRepository.updateAsync(id, userId, input);

			if (!note) {
				return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Note updated", note);
		} catch (ex) {
			logger.error(`Error updating note: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while updating note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async patchState(userId: number, id: number, input: PatchNoteStateInput): Promise<ServiceResponse<NoteData | null>> {
		try {
			const note = await this.noteRepository.patchStateAsync(id, userId, input);

			if (!note) {
				return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Note updated", note);
		} catch (ex) {
			logger.error(`Error updating note state: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while updating note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async delete(userId: number, id: number): Promise<ServiceResponse<null>> {
		try {
			const deleted = await this.noteRepository.deleteAsync(id, userId);

			if (!deleted) {
				return ServiceResponse.failure("Note not found", null, StatusCodes.NOT_FOUND);
			}

			return ServiceResponse.success("Note deleted", null);
		} catch (ex) {
			logger.error(`Error deleting note: ${(ex as Error).message}`);
			return ServiceResponse.failure("An error occurred while deleting note.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async stats(userId: number): Promise<ServiceResponse<{ notes: number; favorites: number }>> {
		try {
			return ServiceResponse.success("Note stats found", await this.noteRepository.countByUserAsync(userId));
		} catch (ex) {
			logger.error(`Error finding note stats: ${(ex as Error).message}`);
			return ServiceResponse.failure(
				"An error occurred while finding note stats.",
				{ notes: 0, favorites: 0 },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const noteService = new NoteService();
