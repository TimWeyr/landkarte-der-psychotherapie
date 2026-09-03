import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseImportedState,
  migrateStoredState,
  saveStateToStorage,
  loadStateFromStorage,
  isDeeplyValidUserState,
  isStorageInReadOnlyMode,
  setStorageReadOnlyMode,
  CURRENT_SCHEMA_VERSION,
  getDefaultState
} from '../src/state/storage';
import { store } from '../src/state/store';
import { importStateFromJson } from '../src/state/exporter';

// Mock localStorage for Node environment in tests
const localStorageMock = (() => {
  let storageStore: Record<string, string> = {};
  return {
    getItem: (key: string) => storageStore[key] || null,
    setItem: (key: string, value: string) => {
      storageStore[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete storageStore[key];
    },
    clear: () => {
      storageStore = {};
    },
    getStore: () => storageStore
  };
})();

(globalThis as any).localStorage = localStorageMock;

describe('Storage Hardening, Deep Validation & Failover Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    setStorageReadOnlyMode(false);
    store.replaceState(getDefaultState());
  });

  it('should validate deep UserState structure accurately', () => {
    const valid = getDefaultState();
    expect(isDeeplyValidUserState(valid)).toBe(true);

    const invalid = { ...valid, artifacts: [{ invalidProp: true }] };
    expect(isDeeplyValidUserState(invalid)).toBe(false);
  });

  it('should parse valid state JSON correctly during import', () => {
    const validState = getDefaultState();
    validState.visitedLocations.push('loc_lighthouse');
    validState.bookmarks.push({
      id: 'bm_test',
      title: 'Test Frage',
      summary: 'Test Zusammenfassung',
      originSceneId: 'scene_lighthouse',
      originSceneTitle: 'Leuchtturm',
      timestamp: 123456789
    });

    const json = JSON.stringify(validState);
    const { result, status } = parseImportedState(json);

    expect(status.success).toBe(true);
    expect(result).not.toBeNull();
    expect(result?.visitedLocations).toContain('loc_lighthouse');
    expect(result?.bookmarks[0].title).toBe('Test Frage');
  });

  it('should reject invalid JSON during import with INVALID_JSON error', () => {
    const { result, status } = parseImportedState('{ invalid json content ...');
    expect(status.success).toBe(false);
    expect(status.error).toBe('INVALID_JSON');
    expect(result).toBeNull();
  });

  it('should reject incompatible schema versions during import with UNSUPPORTED_VERSION', () => {
    const futureState = { ...getDefaultState(), schemaVersion: 99 };
    const { result, status } = parseImportedState(JSON.stringify(futureState));

    expect(status.success).toBe(false);
    expect(status.error).toBe('UNSUPPORTED_VERSION');
    expect(result).toBeNull();
  });

  it('should reject corrupted items inside arrays with CORRUPTED_DATA and not convert them silently', () => {
    const corruptedState = {
      ...getDefaultState(),
      bookmarks: [{ id: 123, brokenField: 'invalid' }] // id should be string, missing title etc.
    };

    const { result, status } = parseImportedState(JSON.stringify(corruptedState));
    expect(status.success).toBe(false);
    expect(status.error).toBe('CORRUPTED_DATA');
    expect(result).toBeNull();
  });

  it('should not alter AppStore state when an import fails', () => {
    const initialState = getDefaultState();
    initialState.visitedLocations.push('loc_station');
    store.replaceState(initialState);

    const importRes = importStateFromJson('CORRUPTED JSON');
    expect(importRes.success).toBe(false);

    const currentState = store.getState();
    expect(currentState.visitedLocations).toContain('loc_station');
  });

  it('should recover gracefully and save exact corrupted JSON to recovery key', () => {
    const corruptedJson = '{"schemaVersion":1,"bookmarks":"NOT_AN_ARRAY"}';

    const recoveredState = migrateStoredState(corruptedJson);
    expect(recoveredState).toEqual(getDefaultState());

    const keys = Object.keys(localStorageMock.getStore());
    const recoveryKey = keys.find(k => k.startsWith('psychotherapie_landkarte_corrupted_recovery_'));
    expect(recoveryKey).toBeDefined();
    expect(localStorageMock.getItem(recoveryKey!)).toBe(corruptedJson);
  });

  it('should activate read-only protection and NOT overwrite primary storage key if recovery backup fails', () => {
    const corruptedJson = '{"schemaVersion":1,"invalid":"data"}';
    localStorageMock.setItem('psychotherapie_landkarte_state_v1', corruptedJson);

    // Mock setItem to throw when writing recovery key
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = (key: string, val: string) => {
      if (key.startsWith('psychotherapie_landkarte_corrupted_recovery_')) {
        throw new Error('QuotaExceeded / Disk Full');
      }
      originalSetItem(key, val);
    };

    const recoveredState = migrateStoredState(corruptedJson);
    expect(recoveredState).toEqual(getDefaultState());
    expect(isStorageInReadOnlyMode()).toBe(true);

    // Now attempt to save state - should be blocked by read-only protection!
    const newState = getDefaultState();
    newState.visitedLocations.push('loc_lighthouse');
    saveStateToStorage(newState);

    // Primary storage key must still contain the original corrupted data, NOT the new state!
    expect(localStorageMock.getItem('psychotherapie_landkarte_state_v1')).toBe(corruptedJson);

    // Restore setItem
    localStorageMock.setItem = originalSetItem;
  });
});
