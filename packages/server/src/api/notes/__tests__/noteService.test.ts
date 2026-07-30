import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import { NoteRepository } from "@/api/notes/noteRepository";
import { NoteService } from "@/api/notes/noteService";

vi.mock("@/api/notes/noteRepository");

describe("noteService", () => {
	let noteServiceInstance: NoteService;
	let noteRepositoryInstance: NoteRepository;

	const mockNote = {
		id: 1,
		title: "产品需求评审会议",
		content: "下周一下午3点在3F会议室开产品需求评审会议。",
		isPinned: true,
		isFavorite: false,
		userId: 1,
		createdAt: new Date("2026-07-30T00:00:00.000Z"),
		updatedAt: new Date("2026-07-30T00:00:00.000Z"),
	};

	beforeEach(() => {
		noteRepositoryInstance = new NoteRepository();
		noteServiceInstance = new NoteService(noteRepositoryInstance);
	});

	it("finds notes for the current user", async () => {
		(noteRepositoryInstance.findManyByUserAsync as Mock).mockResolvedValue([mockNote]);

		const result = await noteServiceInstance.findAll(1, { q: "会议", favorite: "true" });

		expect(result.statusCode).toEqual(StatusCodes.OK);
		expect(result.data).toEqual([mockNote]);
		expect(noteRepositoryInstance.findManyByUserAsync).toHaveBeenCalledWith(1, {
			q: "会议",
			favorite: true,
		});
	});

	it("creates a note", async () => {
		(noteRepositoryInstance.createAsync as Mock).mockResolvedValue(mockNote);

		const result = await noteServiceInstance.create(1, {
			title: mockNote.title,
			content: mockNote.content,
		});

		expect(result.statusCode).toEqual(StatusCodes.CREATED);
		expect(result.data?.title).toEqual(mockNote.title);
		expect(noteRepositoryInstance.createAsync).toHaveBeenCalledWith(1, {
			title: mockNote.title,
			content: mockNote.content,
		});
	});

	it("updates note content", async () => {
		(noteRepositoryInstance.updateAsync as Mock).mockResolvedValue({ ...mockNote, title: "更新标题" });

		const result = await noteServiceInstance.update(1, 1, { title: "更新标题" });

		expect(result.statusCode).toEqual(StatusCodes.OK);
		expect(result.data?.title).toEqual("更新标题");
		expect(noteRepositoryInstance.updateAsync).toHaveBeenCalledWith(1, 1, { title: "更新标题" });
	});

	it("patches pin and favorite state", async () => {
		(noteRepositoryInstance.patchStateAsync as Mock).mockResolvedValue({
			...mockNote,
			isFavorite: true,
		});

		const result = await noteServiceInstance.patchState(1, 1, { isFavorite: true });

		expect(result.statusCode).toEqual(StatusCodes.OK);
		expect(result.data?.isFavorite).toBeTruthy();
		expect(noteRepositoryInstance.patchStateAsync).toHaveBeenCalledWith(1, 1, { isFavorite: true });
	});

	it("returns not found when updating a missing note", async () => {
		(noteRepositoryInstance.updateAsync as Mock).mockResolvedValue(null);

		const result = await noteServiceInstance.update(1, 999, { title: "missing" });

		expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
		expect(result.success).toBeFalsy();
	});

	it("deletes a note", async () => {
		(noteRepositoryInstance.deleteAsync as Mock).mockResolvedValue(true);

		const result = await noteServiceInstance.delete(1, 1);

		expect(result.statusCode).toEqual(StatusCodes.OK);
		expect(result.success).toBeTruthy();
		expect(noteRepositoryInstance.deleteAsync).toHaveBeenCalledWith(1, 1);
	});
});
