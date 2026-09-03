import { describe, it, expect, beforeEach } from 'vitest';
import { ATLAS_LOCATIONS } from '../src/prototypes/innerAtlas/data/atlasLocations';
import { ATLAS_EDGES } from '../src/prototypes/innerAtlas/data/atlasEdges';
import { ATLAS_ROUTES } from '../src/prototypes/innerAtlas/data/atlasRoutes';
import { WORLD_DATA } from '../src/data/worldData';
import { InnerAtlasView } from '../src/prototypes/innerAtlas/ui/InnerAtlasView';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';

describe('Inner Atlas Prototype V0.1 Integrity & Topology Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    store.replaceState(getDefaultState());
  });

  it('should contain exactly 37 locations (7 existing + 30 new) without ID collisions', () => {
    expect(ATLAS_LOCATIONS.length).toBe(37);

    const existingIds = WORLD_DATA.locations.map(l => l.id);
    expect(existingIds.length).toBe(7);

    const newLocations = ATLAS_LOCATIONS.filter(l => !existingIds.includes(l.id));
    expect(newLocations.length).toBe(30);

    const allIds = ATLAS_LOCATIONS.map(l => l.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(37);
  });

  it('should have all coordinates strictly within the valid range (0% - 100%)', () => {
    for (const loc of ATLAS_LOCATIONS) {
      expect(loc.xPercent).toBeGreaterThanOrEqual(0);
      expect(loc.xPercent).toBeLessThanOrEqual(100);
      expect(loc.yPercent).toBeGreaterThanOrEqual(0);
      expect(loc.yPercent).toBeLessThanOrEqual(100);
    }
  });

  it('should have every topological edge reference valid existing locations', () => {
    const locationMap = new Map(ATLAS_LOCATIONS.map(l => [l.id, l]));

    for (const edge of ATLAS_EDGES) {
      expect(locationMap.has(edge.fromLocationId)).toBe(true);
      expect(locationMap.has(edge.toLocationId)).toBe(true);
      expect(edge.fromLocationId).not.toBe(edge.toLocationId);
      expect(edge.reason.length).toBeGreaterThan(5);
    }
  });

  it('should have every route reference valid existing locations', () => {
    const locationMap = new Map(ATLAS_LOCATIONS.map(l => [l.id, l]));

    expect(ATLAS_ROUTES.length).toBe(6); // 5 Compass + 1 Care route
    for (const route of ATLAS_ROUTES) {
      expect(route.locationIds.length).toBeGreaterThanOrEqual(4);
      for (const locId of route.locationIds) {
        expect(locationMap.has(locId)).toBe(true);
      }
    }
  });

  it('should have valid asset references and non-empty metadata for each location', () => {
    for (const loc of ATLAS_LOCATIONS) {
      expect(loc.userQuestion.length).toBeGreaterThan(10);
      expect(loc.themeSummary.length).toBeGreaterThan(10);
      expect(loc.whatItDoesNotClaim.length).toBeGreaterThan(10);
      expect(loc.directNeighborIds.length).toBeGreaterThanOrEqual(2);
      expect(loc.landmarkIconSrc.length).toBeGreaterThan(5);
      expect(loc.sceneConceptSrc.length).toBeGreaterThan(5);
    }
  });

  it('should render interactive InnerAtlasView and select location without mutating userState', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const initialInventory = store.getState().inventory;

    const atlasView = new InnerAtlasView({
      container,
      onEnterActiveScene: () => {},
      onBackToProduction: () => {}
    });

    container.appendChild(atlasView.getElement());

    // Check DOM structures
    const landmarks = container.querySelectorAll('.atlas-landmark');
    expect(landmarks.length).toBe(37);

    // Select a concept location
    const windmillLoc = ATLAS_LOCATIONS.find(l => l.id === 'loc_thought_windmill')!;
    atlasView.selectLocation(windmillLoc);

    const drawer = container.querySelector('#atlas-preview-drawer');
    expect(drawer?.classList.contains('hidden')).toBe(false);
    expect(drawer?.textContent).toContain('Windmühle der Gedanken');
    expect(drawer?.textContent).toContain('Warum läuft mein Kopf immer weiter?');
    expect(drawer?.textContent).toContain('Was dieser Ort nicht behauptet:');

    // Verify UserState remains completely untouched
    const afterInventory = store.getState().inventory;
    expect(afterInventory).toEqual(initialInventory);
  });
});
