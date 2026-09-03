import { UserState } from '../types';

const STORAGE_KEY = 'psychotherapie_landkarte_state_v1';
const RECOVERY_KEY_PREFIX = 'psychotherapie_landkarte_corrupted_recovery_';
export const CURRENT_SCHEMA_VERSION = 1;

export interface ImportResult {
  success: boolean;
  error?: 'INVALID_JSON' | 'UNSUPPORTED_VERSION' | 'CORRUPTED_DATA';
  message: string;
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

/**
 * Validiert die Mindeststruktur eines UserState Objekts
 */
function isValidStateStructure(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

/**
 * Wandelt ein validiertes Objekt sicher in einen vollständigen UserState um
 */
function sanitizeUserState(data: Record<string, unknown>): UserState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    visitedLocations: Array.isArray(data.visitedLocations) ? data.visitedLocations.filter((x): x is string => typeof x === 'string') : [],
    inspectedHotspots: Array.isArray(data.inspectedHotspots) ? data.inspectedHotspots.filter((x): x is string => typeof x === 'string') : [],
    artifacts: Array.isArray(data.artifacts) ? data.artifacts : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
    aboutMeMarks: Array.isArray(data.aboutMeMarks) ? data.aboutMeMarks : [],
    bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
    quizAnswers: data.quizAnswers && typeof data.quizAnswers === 'object' && !Array.isArray(data.quizAnswers) ? (data.quizAnswers as UserState['quizAnswers']) : {},
    settings: {
      introSeen: Boolean((data.settings as Record<string, unknown> | undefined)?.introSeen),
      soundEnabled: Boolean((data.settings as Record<string, unknown> | undefined)?.soundEnabled)
    }
  };
}

/**
 * Sichert beschädigte Daten vor dem Überschreiben
 */
function backupCorruptedData(rawJson: string): void {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(`${RECOVERY_KEY_PREFIX}${timestamp}`, rawJson);
    console.warn(`Beschädigter Spielstand wurde unter ${RECOVERY_KEY_PREFIX}${timestamp} gesichert.`);
  } catch (backupError: unknown) {
    console.error('Konnte Sicherung der beschädigten Daten nicht in localStorage schreiben:', backupError);
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

    if (!isValidStateStructure(data)) {
      backupCorruptedData(rawJson);
      return getDefaultState();
    }

    const version = typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;

    if (version === CURRENT_SCHEMA_VERSION) {
      return sanitizeUserState(data);
    }

    // Unbekannte Version im localStorage -> Backup anlegen
    backupCorruptedData(rawJson);
    return getDefaultState();
  } catch (parseError: unknown) {
    backupCorruptedData(rawJson);
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

    if (!isValidStateStructure(data)) {
      return {
        result: null,
        status: {
          success: false,
          error: 'INVALID_JSON',
          message: 'Die Datei enthält kein gültiges Spielstand-Objekt.'
        }
      };
    }

    const version = typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;

    if (version !== CURRENT_SCHEMA_VERSION) {
      return {
        result: null,
        status: {
          success: false,
          error: 'UNSUPPORTED_VERSION',
          message: `Inkompatible Spielstand-Version (${version || 'unbekannt'}). Erwartet wird Version ${CURRENT_SCHEMA_VERSION}.`
        }
      };
    }

    // Zusätzliche Typprüfung auf essentielle Felder
    if (data.visitedLocations && !Array.isArray(data.visitedLocations)) {
      return {
        result: null,
        status: {
          success: false,
          error: 'CORRUPTED_DATA',
          message: 'Die Datei enthält beschädigte Datenstrukturen.'
        }
      };
    }

    const sanitized = sanitizeUserState(data);
    return {
      result: sanitized,
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return migrateStoredState(raw);
  } catch (error: unknown) {
    console.warn('Failed to load state from localStorage:', error);
    return getDefaultState();
  }
}

export function saveStateToStorage(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error: unknown) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error: unknown) {
    console.error('Failed to clear localStorage:', error);
  }
}
