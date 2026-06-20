export interface MindData {
  mood: number | null;
  journal: string;
  grat: [string, string, string];
}

export interface DayData {
  date: string;
  cigs: number;
  mind: MindData;
  missions: Record<string, boolean>;
}

export interface MediaItem {
  id: number;
  date: string;
  originalName: string;
  mimeType: string;
  note: string;
  size: number;
  createdAt: string;
}

export interface AppState {
  days: Record<string, DayData>;
  quests: Record<string, boolean>;
  affIdx: number;
}
