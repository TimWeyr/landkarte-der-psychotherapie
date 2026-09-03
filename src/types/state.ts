import { ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry } from './inventory';

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface UserSettings {
  introSeen: boolean;
  soundEnabled: boolean;
}

export interface UserState {
  schemaVersion: number; // Current version: 1
  visitedLocations: string[]; // List of location IDs visited
  inspectedHotspots: string[]; // List of hotspot IDs opened
  artifacts: ArtifactEntry[]; // Collected items
  interests: InterestEntry[]; // Marked "Das interessiert mich"
  aboutMeMarks: AboutMeEntry[]; // Marked "Das beschreibt etwas von mir"
  bookmarks: BookmarkEntry[]; // Marked "Für später merken"
  quizAnswers: Record<string, QuizAnswer>; // Solved quizzes
  settings: UserSettings;
}

export type StateListener = (state: UserState) => void;
