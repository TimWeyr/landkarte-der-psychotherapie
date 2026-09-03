import { UserState, ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry, QuizAnswer } from '../types';

const STORAGE_KEY = 'psychotherapie_landkarte_state_v1';
const RECOVERY_KEY_PREFIX = 'psychotherapie_landkarte_corrupted_recovery_';
export const CURRENT_SCHEMA_VERSION = 1;

export interface ImportResult {
  success: boolean;
  error?: 'INVALID_JSON' | 'UNSUPPORTED_VERSION' | 'CORRUPTED_DATA';
  message: string;
}

// In-Memory Fallback & Read-Only Protection state
let isStorageReadOnly = false;
let inMemoryState: UserState | null = null;

export function isStorageInReadOnlyMode(): boolean {
  return isStorageReadOnly;
}

export function setStorageReadOnlyMode(readOnly: boolean): void {
  isStorageReadOnly = readOnly;
}

export function getDefaultState(): UserState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    visitedLocations: [],
    inspectedHotspots: [],
    artifacts: [],
    interests: [],
    aboutMeMarks: [],
    bookmarks: [],
    quizAnswers: {},
    settings: {
      introSeen: false,
      soundEnabled: false
    }
  };
}

// --- Deep Type Guards ---

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every(item => typeof item === 'string');
}

function isValidArtifact(val: unknown): val is ArtifactEntry {
  if (typeof val !== 'object' || val === null) return false;
  const a = val as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.title === 'string' &&
    typeof a.description === 'string' &&
    typeof a.icon === 'string' &&
    typeof a.originSceneId === 'string' &&
    typeof a.originSceneTitle === 'string' &&
    typeof a.timestamp === 'number'
  );
}

function isValidInterest(val: unknown): val is InterestEntry {
  if (typeof val !== 'object' || val === null) return false;
  const i = val as Record<string, unknown>;
  return (
    typeof i.id === 'string' &&
    typeof i.title === 'string' &&
    (i.note === undefined || typeof i.note === 'string') &&
    typeof i.originSceneId === 'string' &&
    typeof i.originSceneTitle === 'string' &&
    typeof i.timestamp === 'number'
  );
}

function isValidAboutMe(val: unknown): val is AboutMeEntry {
  if (typeof val !== 'object' || val === null) return false;
  const m = val as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.statement === 'string' &&
    typeof m.originSceneId === 'string' &&
    typeof m.originSceneTitle === 'string' &&
    typeof m.timestamp === 'number'
  );
}

function isValidBookmark(val: unknown): val is BookmarkEntry {
  if (typeof val !== 'object' || val === null) return false;
  const b = val as Record<string, unknown>;
  return (
    typeof b.id === 'string' &&
    typeof b.title === 'string' &&
    (b.summary === undefined || typeof b.summary === 'string') &&
    typeof b.originSceneId === 'string' &&
    typeof b.originSceneTitle === 'string' &&
    typeof b.timestamp === 'number'
  );
}

function isValidQuizAnswer(val: unknown): val is QuizAnswer {
  if (typeof val !== 'object' || val === null) return false;
  const q = val as Record<string, unknown>;
  return (
    typeof q.questionId === 'string' &&
    typeof q.selectedOption === 'number' &&
    typeof q.isCorrect === 'boolean' &&
    typeof q.timestamp === 'number'
  );
}

function isValidQuizAnswersRecord(val: unknown): val is Record<string, QuizAnswer> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) return false;
  const record = val as Record<string, unknown>;
  return Object.values(record).every(isValidQuizAnswer);
}

function isValidSettings(val: unknown): val is { introSeen: boolean; soundEnabled: boolean } {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) return false;
  const s = val as Record<string, unknown>;
  return typeof s.introSeen === 'boolean' && typeof s.soundEnabled === 'boolean';
}

/**
 * Validiert die vollständige Struktur eines UserState-Objekts tiefgreifend
 */
export function isDeeplyValidUserState(data: unknown): data is UserState {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  const d = data as Record<string, unknown>;

  return (
    d.schemaVersion === CURRENT_SCHEMA_VERSION &&
    isStringArray(d.visitedLocations) &&
    isStringArray(d.inspectedHotspots) &&
    Array.isArray(d.artifacts) && d.artifacts.every(isValidArtifact) &&
    Array.isArray(d.interests) && d.interests.every(isValidInterest) &&
    Array.isArray(d.aboutMeMarks) && d.aboutMeMarks.every(isValidAboutMe) &&
    Array.isArray(d.bookmarks) && d.bookmarks.every(isValidBookmark) &&
    isValidQuizAnswersRecord(d.quizAnswers) &&
    isValidSettings(d.settings)
  );
}

/**
 * Sichert beschädigte Daten vor dem Überschreiben.
 * Gibt true zurück, wenn das Backup erfolgreich gespeichert wurde.
 */
function backupCorruptedData(rawJson: string): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(`${RECOVERY_KEY_PREFIX}${timestamp}`, rawJson);
    console.warn(`Beschädigter Spielstand wurde unter ${RECOVERY_KEY_PREFIX}${timestamp} gesichert.`);
    return true;
  } catch (backupError: unknown) {
    console.error('Konnte Sicherung der beschädigten Daten nicht in localStorage schreiben:', backupError);
    return false;
  }
}

/**
 * Robuster Start beim Laden der Anwendung aus dem localStorage
 */
export function migrateStoredState(rawJson: string | null): UserState {
  if (!rawJson) {
    return getDefaultState();
  }

  try {
    const data: unknown = JSON.parse(rawJson);

    if (isDeeplyValidUserState(data)) {
      isStorageReadOnly = false;
      return data;
    }

    // Ungültige oder korrupte Struktur
    const backupSuccess = backupCorruptedData(rawJson);
    if (!backupSuccess) {
      // Failover: Wenn das Backup nicht angelegt werden konnte, schütze den Speicher vor Überschreiben
      isStorageReadOnly = true;
      console.warn('Storage in Read-Only-Modus versetzt, um bestehende Rohdaten vor Überschreiben zu schützen.');
    }

    return getDefaultState();
  } catch (parseError: unknown) {
    const backupSuccess = backupCorruptedData(rawJson);
    if (!backupSuccess) {
      isStorageReadOnly = true;
    }
    console.warn('LocalStorage-Daten konnten nicht geparst werden. Starte mit Standardzustand.', parseError);
    return getDefaultState();
  }
}

/**
 * Strenger Import beim manuellen Hochladen einer JSON-Datei
 */
export function parseImportedState(rawJson: string): { result: UserState | null; status: ImportResult } {
  try {
    const data: unknown = JSON.parse(rawJson);

    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return {
        result: null,
        status: {
          success: false,
          error: 'INVALID_JSON',
          message: 'Die Datei enthält kein gültiges JSON-Objekt.'
        }
      };
    }

    const version = (data as Record<string, unknown>).schemaVersion;
    if (typeof version !== 'number' || version !== CURRENT_SCHEMA_VERSION) {
      return {
        result: null,
        status: {
          success: false,
          error: 'UNSUPPORTED_VERSION',
          message: `Inkompatible Spielstand-Version (${version ?? 'unbekannt'}). Erwartet wird Version ${CURRENT_SCHEMA_VERSION}.`
        }
      };
    }

    if (!isDeeplyValidUserState(data)) {
      return {
        result: null,
        status: {
          success: false,
          error: 'CORRUPTED_DATA',
          message: 'Die Datei enthält beschädigte oder ungültige Datenstrukturen.'
        }
      };
    }

    return {
      result: data,
      status: {
        success: true,
        message: 'Reisezustand erfolgreich importiert!'
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ungültiges Format';
    return {
      result: null,
      status: {
        success: false,
        error: 'INVALID_JSON',
        message: `Import-Fehler: ${message}`
      }
    };
  }
}

export function loadStateFromStorage(): UserState {
  if (typeof localStorage === 'undefined') {
    return inMemoryState || getDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return migrateStoredState(raw);
  } catch (error: unknown) {
    console.warn('Failed to load state from localStorage:', error);
    return getDefaultState();
  }
}

export function saveStateToStorage(state: UserState): void {
  // Wenn der Storage im Read-Only-Sicherheitsmodus ist, niemals den Primärschlüssel überschreiben
  if (isStorageReadOnly) {
    inMemoryState = state;
    console.warn('Speichern in localStorage blockiert (Read-Only-Sicherheitsmodus aktiv). Zustand verbleibt in-memory.');
    return;
  }

  if (typeof localStorage === 'undefined') {
    inMemoryState = state;
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error: unknown) {
    console.error('Failed to save state to localStorage:', error);
    inMemoryState = state;
  }
}

export function clearStorage(): void {
  isStorageReadOnly = false;
  inMemoryState = null;
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error: unknown) {
    console.error('Failed to clear localStorage:', error);
  }
}
