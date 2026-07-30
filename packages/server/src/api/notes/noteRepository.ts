import { prisma } from "@/common/utils/prismaClient";
import type { Note } from "@/generated/prisma/client";

export class NoteRepository {
	async findManyByUserAsync(userId: number, options: { q?: string; favorite?: boolean } = {}): Promise<Note[]> {
		const search = options.q?.trim();

		return prisma.note.findMany({
			where: {
				userId,
				...(typeof options.favorite === "boolean" ? { isFavorite: options.favorite } : {}),
				...(search
					? {
							OR: [{ title: { contains: search } }, { content: { contains: search } }],
						}
					: {}),
			},
			orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
		});
	}

	async findByIdForUserAsync(id: number, userId: number): Promise<Note | null> {
		return prisma.note.findFirst({ where: { id, userId } });
	}

	async createAsync(userId: number, data: { title: string; content: string }): Promise<Note> {
		return prisma.note.create({
			data: {
				userId,
				title: data.title,
				content: data.content,
			},
		});
	}

	async updateAsync(
		id: number,
		userId: number,
		data: Partial<{ title: string; content: string }>,
	): Promise<Note | null> {
		const existing = await this.findByIdForUserAsync(id, userId);

		if (!existing) {
			return null;
		}

		return prisma.note.update({ where: { id }, data });
	}

	async patchStateAsync(
		id: number,
		userId: number,
		data: Partial<{ isPinned: boolean; isFavorite: boolean }>,
	): Promise<Note | null> {
		const existing = await this.findByIdForUserAsync(id, userId);

		if (!existing) {
			return null;
		}

		return prisma.note.update({ where: { id }, data });
	}

	async deleteAsync(id: number, userId: number): Promise<boolean> {
		const existing = await this.findByIdForUserAsync(id, userId);

		if (!existing) {
			return false;
		}

		await prisma.note.delete({ where: { id } });
		return true;
	}

	async countByUserAsync(userId: number): Promise<{ notes: number; favorites: number }> {
		const [notes, favorites] = await Promise.all([
			prisma.note.count({ where: { userId } }),
			prisma.note.count({ where: { userId, isFavorite: true } }),
		]);

		return { notes, favorites };
	}
}
