import { http } from "@/libs/http";

export type Note = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type NoteStats = {
  notes: number;
  favorites: number;
};

export type NoteInput = {
  title: string;
  content: string;
};

export type NoteQuery = {
  q?: string;
  favorite?: boolean;
};

export function getNotes(query: NoteQuery = {}) {
  return http.get<Note[]>("/notes", {
    params: {
      q: query.q || undefined,
      favorite: query.favorite === undefined ? undefined : String(query.favorite),
    },
  });
}

export function getNote(id: number) {
  return http.get<Note>(`/notes/${id}`);
}

export function createNote(input: NoteInput) {
  return http.post<Note>("/notes", input);
}

export function updateNote(id: number, input: Partial<NoteInput>) {
  return http.put<Note>(`/notes/${id}`, input);
}

export function updateNoteState(id: number, input: Partial<Pick<Note, "isPinned" | "isFavorite">>) {
  return http.patch<Note>(`/notes/${id}`, input);
}

export function deleteNote(id: number) {
  return http.del<null>(`/notes/${id}`);
}

export function getNoteStats() {
  return http.get<NoteStats>("/notes/stats");
}
