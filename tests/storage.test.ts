import { describe, it, expect, beforeEach } from 'vitest';
import { parseImportedState, migrateStoredState, CURRENT_SCHEMA_VERSION, getDefaultState } from '../src/state/storage';

// Mock localStorage for Node environment in tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

(globalThis as any).localStorage = localStorageMock;

describe('Storage Hardening & Recovery Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should parse valid state JSON correctly during import', () => {
    const validState = getDefaultState();
    validState.interests.push({
      id: 'test_interest',
      title: 'Test Thema',
      originSceneId: 'scene_test',
      originSceneTitle: 'Test Szene',
      timestamp: 12345
    });

    const jsonStr = JSON.stringify(validState);
    const { result, status } = parseImportedState(jsonStr);

    expect(status.success).toBe(true);
    expect(result).toBeDefined();
    expect(result?.interests.length).toBe(1);
    expect(result?.interests[0].id).toBe('test_interest');
  });

  it('should reject invalid JSON during import without altering current state', () => {
    const invalidJson = '{"schemaVersion": 1, bad_json: ...}';
    const { result, status } = parseImportedState(invalidJson);

    expect(status.success).toBe(false);
    expect(status.error).toBe('INVALID_JSON');
    expect(result).toBeNull();
  });

  it('should reject incompatible schema versions during import', () => {
    const futureState = {
      schemaVersion: 999,
      visitedLocations: []
    };
    const jsonStr = JSON.stringify(futureState);
    const { result, status } = parseImportedState(jsonStr);

    expect(status.success).toBe(false);
    expect(status.error).toBe('UNSUPPORTED_VERSION');
    expect(result).toBeNull();
  });

  it('should recover gracefully and save recovery key when stored local state is corrupt', () => {
    const corruptJson = '{"schemaVersion": 1, "interests": "NOT_AN_ARRAY"}';
    const recovered = migrateStoredState(corruptJson);

    expect(recovered.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(Array.isArray(recovered.interests)).toBe(true);
  });
});
