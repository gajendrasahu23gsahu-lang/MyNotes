
export type NoteTag = string;
export type NoteType = 'text' | 'image' | 'slide' | 'diagram' | 'table' | 'sheet';

export interface DiagramNode {
  id: string;
  text: string;
  children: DiagramNode[];
}

export interface TableData {
  cells: string[][];
}

export interface SheetCell {
  value: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  bgColor?: string;
}

export interface SheetData {
  cells: Record<string, SheetCell>;
  rowCount: number;
  colCount: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type?: NoteType;
  imageUrl?: string;
  slides?: string[];
  diagramData?: DiagramNode;
  tableData?: TableData;
  sheetData?: SheetData;
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
  theme: 'light' | 'dark' | 'dim';
}
