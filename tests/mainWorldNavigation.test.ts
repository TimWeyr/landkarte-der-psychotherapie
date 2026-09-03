import { describe, it, expect, beforeEach } from 'vitest';
import { MAJOR_REGIONS, getMajorRegionById } from '../src/data/mainWorldData';
import { MainWorldView } from '../src/ui/MainWorldView';
import { RegionOverviewDrawer } from '../src/ui/RegionOverviewDrawer';
import { Application } from '../src/main';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';

describe('Level 1: Große Landkarte der Psychotherapie Navigation & Data Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    store.replaceState(getDefaultState());
  });

  it('should define all 5 major regions with complete metadata and valid coordinates', () => {
    expect(MAJOR_REGIONS.length).toBe(5);

    const ids = MAJOR_REGIONS.map(r => r.id);
    expect(ids).toContain('region_central');
    expect(ids).toContain('region_cbt');
    expect(ids).toContain('region_psychoanalysis');
    expect(ids).toContain('region_systemic');
    expect(ids).toContain('region_humanistic');

    for (const r of MAJOR_REGIONS) {
      expect(r.xPercent).toBeGreaterThanOrEqual(0);
      expect(r.xPercent).toBeLessThanOrEqual(100);
      expect(r.yPercent).toBeGreaterThanOrEqual(0);
      expect(r.yPercent).toBeLessThanOrEqual(100);

      expect(r.corePhilosophy.length).toBeGreaterThan(20);
      expect(r.historicalRoots.length).toBeGreaterThan(15);
      expect(r.typicalWorkingModes.length).toBeGreaterThanOrEqual(3);
      expect(r.whatItDoesNotClaim.length).toBeGreaterThan(20);
      expect(r.futureSubLocations.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('should find region by ID using getMajorRegionById', () => {
    const cbt = getMajorRegionById('region_cbt');
    expect(cbt).toBeDefined();
    expect(cbt?.name).toBe('Kognitive Verhaltenstherapie');

    const central = getMajorRegionById('region_central');
    expect(central?.isCentralRegion).toBe(true);
  });

  it('should render MainWorldView with 5 region markers and central beacon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let enteredCentral = false;
    const worldView = new MainWorldView({
      container,
      onEnterCentralRegion: () => {
        enteredCentral = true;
      }
    });

    container.appendChild(worldView.getElement());

    const markers = container.querySelectorAll('.major-region-marker');
    expect(markers.length).toBe(5);

    const centralMarker = container.querySelector('.major-region-marker.central-beacon');
    expect(centralMarker).not.toBeNull();

    // Test quick central button
    const quickBtn = container.querySelector<HTMLButtonElement>('#btn-quick-central');
    expect(quickBtn).not.toBeNull();
    quickBtn?.click();
    expect(enteredCentral).toBe(true);
  });

  it('should render RegionOverviewDrawer with correct disclaimer and working modes', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let enteredCentral = false;
    const drawer = new RegionOverviewDrawer({
      container,
      onEnterCentralRegion: () => {
        enteredCentral = true;
      }
    });

    const psychoanalysis = getMajorRegionById('region_psychoanalysis')!;
    drawer.show(psychoanalysis);

    const drawerEl = container.querySelector('.region-overview-drawer');
    expect(drawerEl?.classList.contains('hidden')).toBe(false);
    expect(drawerEl?.textContent).toContain('Psychoanalyse & Tiefenpsychologie');
    expect(drawerEl?.textContent).toContain('Was dieser Ansatz nicht behauptet');
    expect(drawerEl?.textContent).toContain('Freie Assoziation');

    // Close
    drawer.hide();
    expect(drawerEl?.classList.contains('hidden')).toBe(true);
  });

  it('should support full 3-level navigation hierarchy in Application', () => {
    const appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);

    const app = new Application(appContainer);

    // Level 1: World
    const breadcrumbsHeader = document.querySelector('#header-breadcrumbs');
    expect(breadcrumbsHeader?.textContent).toContain('Ebene 1');

    // Navigate to Level 2: Central Atlas
    app.navigateToLevel('central_atlas');
    expect(breadcrumbsHeader?.textContent).toContain('Zentralregion');
    expect(document.querySelector('.inner-atlas-root')).not.toBeNull();

    // Navigate to Level 3: Scene (Werkstatt)
    app.navigateToLevel('scene', 'scene_workshop');
    expect(breadcrumbsHeader?.textContent).toContain('Werkstatt der Erprobung');
    expect(document.querySelector('.scene-view-container')).not.toBeNull();

    // Navigate back to Level 2
    app.navigateToLevel('central_atlas');
    expect(breadcrumbsHeader?.textContent).toContain('Zentralregion');

    // Navigate back to Level 1
    app.navigateToLevel('world');
    expect(breadcrumbsHeader?.textContent).toContain('Ebene 1');
    expect(document.querySelector('.main-world-root')).not.toBeNull();
  });
});
