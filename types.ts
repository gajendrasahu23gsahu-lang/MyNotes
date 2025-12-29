
export type NoteTag = 'Work' | 'Personal' | 'Ideas' | 'Urgent' | 'Draft';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: NoteTag[];
  updatedAt: number;
  createdAt: number;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppState {
  notes: Note[];
  currentUser: User | null;
  theme: 'light' | 'dark';
}
