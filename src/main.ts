import './styles/main.css';
import './styles/map.css';
import './styles/scenes.css';
import './styles/backpack.css';
import './styles/dialogue.css';

import { WORLD_DATA } from './data/worldData';
import { getSceneById } from './data/scenes';
import { store } from './state/store';
import { MapEngine } from './engine/MapEngine';
import { IntroScreen } from './ui/IntroScreen';
import { BackpackPanel } from './ui/BackpackPanel';
import { ActionModal } from './ui/ActionModal';
import { SceneView } from './ui/SceneView';
import { LocationNode, Scene, RouteOption, UserState } from './types';

class Application {
  private root: HTMLElement;
  private mapContainer!: HTMLElement;
  private mapEngine!: MapEngine;
  private backpackPanel!: BackpackPanel;
  private actionModal!: ActionModal;
  private currentSceneView: SceneView | null = null;
  private activeTeaserCard: HTMLElement | null = null;
  private routeHighlightBanner: HTMLElement | null = null;

  constructor() {
    this.root = document.getElementById('app') as HTMLElement;
    this.init();
  }

  private async init(): Promise<void> {
    this.buildBaseDOM();
    this.backpackPanel = new BackpackPanel();
    this.actionModal = new ActionModal();

    // Initialize Map Engine
    this.mapEngine = new MapEngine({
      container: this.mapContainer,
      worldData: WORLD_DATA,
      onLocationSelect: (loc, pos) => this.handleLocationSelect(loc, pos),
      onLocationHover: (_loc, _pos) => {
        // Subtle hover handling if needed
      }
    });

    await this.mapEngine.init();

    // Check onboarding
    const state = store.getState();
    if (!state.settings.introSeen) {
      const intro = new IntroScreen(() => {
        // Onboarding complete
      });
      intro.show();
    }

    // Subscribe to state to update backpack badge count
    store.subscribe((currState) => {
      this.updateBackpackBadge(currState);
    });

    // Close preview cards when clicking outside
    this.mapContainer.addEventListener('pointerdown', (e) => {
      if (this.activeTeaserCard && !this.activeTeaserCard.contains(e.target as Node)) {
        this.closeTeaserCard();
      }
    });
  }

  private buildBaseDOM(): void {
    this.root.innerHTML = `
      <!-- Header HUD -->
      <header class="app-header">
        <div class="header-left">
          <div class="brand-badge">
            <span style="font-size: 1.2rem;">🗺️</span>
            <div>
              <div class="brand-title">Landkarte der Psychotherapie</div>
              <div class="brand-subtitle">Zentralregion • Prototyp V0.1</div>
            </div>
          </div>
        </div>

        <div class="header-right">
          <button class="btn-backpack" id="btn-toggle-backpack" aria-label="Rucksack öffnen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/>
              <path d="M8 10h8"/>
            </svg>
            <span>Rucksack</span>
            <span class="backpack-badge" id="backpack-count">0</span>
          </button>
        </div>
      </header>

      <!-- Map Container -->
      <main class="map-view-container" id="map-container"></main>

      <!-- Map Controls HUD -->
      <div class="map-controls">
        <button class="control-btn" id="btn-zoom-in" title="Vergrößern">+</button>
        <button class="control-btn" id="btn-zoom-out" title="Verkleinern">−</button>
        <button class="control-btn" id="btn-zoom-reset" title="Übersicht">⟲</button>
      </div>

      <!-- Map Guide Bottom-Left -->
      <div class="map-guide">
        <div class="map-guide-title">
          <span>🧭</span> Orientierung
        </div>
        <p>Erkunde die Landschaft per Maus/Touch. Klicke auf goldene Landmarken, um Schauplätze zu betreten.</p>
      </div>
    `;

    this.mapContainer = this.root.querySelector('#map-container') as HTMLElement;

    // Button Listeners
    this.root.querySelector('#btn-toggle-backpack')?.addEventListener('click', () => {
      this.backpackPanel.open();
    });

    this.root.querySelector('#btn-zoom-in')?.addEventListener('click', () => {
      this.mapEngine.zoomIn();
    });

    this.root.querySelector('#btn-zoom-out')?.addEventListener('click', () => {
      this.mapEngine.zoomOut();
    });

    this.root.querySelector('#btn-zoom-reset')?.addEventListener('click', () => {
      this.mapEngine.resetView();
    });
  }

  private updateBackpackBadge(_state: UserState): void {
    const badge = this.root.querySelector('#backpack-count');
    if (badge) {
      const count = store.getTotalCollectedCount();
      badge.textContent = count.toString();
    }
  }

  private handleLocationSelect(location: LocationNode, screenPos: { x: number; y: number }): void {
    this.closeTeaserCard();

    if (location.type === 'scene' && location.sceneId) {
      const scene = getSceneById(location.sceneId);
      if (scene) {
        const region = WORLD_DATA.regions.find(r => r.id === location.regionId);
        this.openScene(scene, region?.name);
      }
    } else {
      this.showLocationTeaserCard(location, screenPos);
    }
  }

  private showLocationTeaserCard(location: LocationNode, pos: { x: number; y: number }): void {
    const card = document.createElement('div');
    card.className = 'location-preview-card';
    card.style.left = `${pos.x}px`;
    card.style.top = `${pos.y}px`;

    card.innerHTML = `
      <div class="preview-badge badge-teaser">${location.badgeText || 'In Entwicklung'}</div>
      <h3 class="preview-title">${location.name}</h3>
      <div class="preview-tagline">${location.tagline}</div>
      <p class="preview-text">${location.teaserText || 'Dieser Ort wird in einer kommenden Version der Psychotherapie-Landkarte begehbar sein.'}</p>
      <div class="preview-actions">
        <button class="btn btn-secondary btn-sm" id="btn-close-teaser">Verstanden</button>
      </div>
    `;

    card.querySelector('#btn-close-teaser')?.addEventListener('click', () => {
      this.closeTeaserCard();
    });

    this.root.appendChild(card);
    this.activeTeaserCard = card;
  }

  public closeTeaserCard(): void {
    if (this.activeTeaserCard) {
      this.activeTeaserCard.remove();
      this.activeTeaserCard = null;
    }
  }

  private openScene(scene: Scene, regionName?: string): void {
    if (this.currentSceneView) {
      this.currentSceneView.destroy();
    }

    // Toggle HUD map controls
    const mapControls = this.root.querySelector('.map-controls') as HTMLElement;
    const mapGuide = this.root.querySelector('.map-guide') as HTMLElement;
    const brandBadge = this.root.querySelector('.brand-badge') as HTMLElement;

    if (mapControls) mapControls.style.display = 'none';
    if (mapGuide) mapGuide.style.display = 'none';
    
    // Unified Breadcrumb Capsule in Header
    if (brandBadge) {
      brandBadge.innerHTML = `
        <button class="breadcrumb-btn" id="btn-header-world" title="Zurück zur Weltkarte">
          <span>🗺️</span> Weltkarte
        </button>
        <span class="breadcrumb-separator">›</span>
        <button class="breadcrumb-btn" id="btn-header-region" title="Zur Region auf der Karte">
          ${regionName || 'Zentralregion'}
        </button>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">${scene.title}</span>
      `;

      brandBadge.querySelector('#btn-header-world')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeScene();
      });

      brandBadge.querySelector('#btn-header-region')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeScene();
      });
    }

    this.currentSceneView = new SceneView(
      {
        container: this.root,
        scene: scene,
        regionName: regionName,
        onBackToMap: () => this.closeScene(),
        onRouteNavigate: (option) => this.handleRouteNavigation(option)
      },
      this.actionModal
    );

    this.root.appendChild(this.currentSceneView.getElement());
  }

  public closeScene(): void {
    if (this.currentSceneView) {
      this.currentSceneView.destroy();
      this.currentSceneView = null;
    }

    // Restore HUD map controls
    const mapControls = this.root.querySelector('.map-controls') as HTMLElement;
    const mapGuide = this.root.querySelector('.map-guide') as HTMLElement;
    const brandBadge = this.root.querySelector('.brand-badge') as HTMLElement;

    if (mapControls) mapControls.style.display = 'flex';
    if (mapGuide) mapGuide.style.display = 'block';
    
    // Restore default Brand Badge title
    if (brandBadge) {
      brandBadge.innerHTML = `
        <span style="font-size: 1.2rem;">🗺️</span>
        <div>
          <div class="brand-title">Landkarte der Psychotherapie</div>
          <div class="brand-subtitle">Zentralregion • Prototyp V0.1</div>
        </div>
      `;
    }
  }

  private handleRouteNavigation(option: RouteOption): void {
    this.closeScene();

    // Resolve target knowledge nodes to world location IDs
    const matchingLocs = WORLD_DATA.locations.filter(loc =>
      loc.knowledgeNodeIds?.some(nId => option.targetKnowledgeNodeIds.includes(nId))
    );
    const targetLocationIds = matchingLocs.map(l => l.id);

    this.mapEngine.highlightLocations(targetLocationIds);
    this.mapEngine.fitLocations(targetLocationIds);

    // Show floating route banner in HUD
    this.showRouteHighlightBanner(option, matchingLocs.length);
  }

  private showRouteHighlightBanner(option: RouteOption, count: number): void {
    if (this.routeHighlightBanner) {
      this.routeHighlightBanner.remove();
      this.routeHighlightBanner = null;
    }

    const banner = document.createElement('div');
    banner.className = 'route-highlight-banner';
    banner.innerHTML = `
      <div class="banner-text">
        <span>🧭</span>
        <span>Hervorgehoben für: <strong>${option.label}</strong> (${count} Schauplätze)</span>
      </div>
      <button class="btn btn-ghost btn-sm" id="btn-clear-highlights" title="Hervorhebung aufheben">✕ Aufheben</button>
    `;

    banner.querySelector('#btn-clear-highlights')?.addEventListener('click', () => {
      this.clearRouteHighlights();
    });

    this.root.appendChild(banner);
    this.routeHighlightBanner = banner;
  }

  public clearRouteHighlights(): void {
    this.mapEngine.clearHighlights();
    if (this.routeHighlightBanner) {
      this.routeHighlightBanner.remove();
      this.routeHighlightBanner = null;
    }
  }
}

// Start application & global shortcuts
window.addEventListener('DOMContentLoaded', () => {
  const app = new Application();

  // Click on Brand Badge in header
  document.querySelector('.brand-badge')?.addEventListener('click', () => {
    app.closeScene();
  });

  // Global Keyboard Shortcuts (ESC & M)
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const activeBackdrop = document.querySelector('.modal-backdrop.active');
      const activeBackpack = document.querySelector('.backpack-modal.active');
      
      if (activeBackdrop) {
        // Modal / Dialogue is open -> close it
        activeBackdrop.classList.remove('active');
      } else if (activeBackpack) {
        // Backpack is open -> close it
        activeBackpack.classList.remove('active');
      } else {
        // Close scene back to map
        app.closeScene();
        app.closeTeaserCard();
        app.clearRouteHighlights();
      }
    } else if (e.key === 'm' || e.key === 'M') {
      // Don't trigger if typing in an input
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        app.closeScene();
      }
    }
  });
});
