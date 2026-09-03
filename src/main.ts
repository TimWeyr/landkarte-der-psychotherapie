import './styles/main.css';
import './styles/map.css';
import './styles/scenes.css';
import './styles/backpack.css';
import './styles/dialogue.css';
import './styles/innerAtlas.css';
import './styles/worldMap.css';

import { WORLD_DATA } from './data/worldData';
import { getSceneById } from './data/scenes';
import { getNodeById } from './data/knowledge';
import { store } from './state/store';
import { BackpackPanel } from './ui/BackpackPanel';
import { ActionModal } from './ui/ActionModal';
import { SceneView } from './ui/SceneView';
import { LocationNode, Scene, RouteOption, UserState } from './types';
import { NavigationLevel } from './types/worldMap';
import { MainWorldView } from './ui/MainWorldView';
import { InnerAtlasView } from './prototypes/innerAtlas/ui/InnerAtlasView';
import { IntroScreen } from './ui/IntroScreen';

export interface RouteNavigationResult {
  highlightedLocationIds: string[];
  bannerHtml: string;
  isNeutralPerspective: boolean;
}

/**
 * Reine Routing-Logik zur Berechnung der Karteneffekte bei Routennavigation (ohne Seiteneffekte).
 * Schließt den aktuellen Ausgangsort (originLocationId) generisch aus.
 */
export function computeRouteNavigationEffect(
  option: RouteOption,
  locations: LocationNode[],
  originLocationId?: string
): RouteNavigationResult {
  if (option.id === 'opt_concrete_action') {
    const matchingLocs = locations.filter(loc =>
      loc.id !== originLocationId &&
      loc.knowledgeNodeIds?.some(nId => option.targetKnowledgeNodeIds.includes(nId))
    );
    const targetLocationIds = matchingLocs.map(l => l.id);
    return {
      highlightedLocationIds: targetLocationIds,
      bannerHtml: `🧭 Erkundungsperspektive: <strong>${option.label}</strong> (Werkstatt der Erprobung hervorgehoben)`,
      isNeutralPerspective: false
    };
  } else {
    return {
      highlightedLocationIds: [],
      bannerHtml: `🧭 Diese Erkundungsperspektive ist vorgemerkt. Die zugehörigen schulenübergreifenden Schauplätze sind noch in Entwicklung. Du kannst die Karte weiter frei erkunden.`,
      isNeutralPerspective: true
    };
  }
}

/**
 * Öffentlicher Renderer für Teaser-Karten
 */
export function renderTeaserCardHtml(location: LocationNode, actionModal: ActionModal): string {
  const nodeClaims = (location.knowledgeNodeIds || [])
    .map(nId => getNodeById(nId))
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .flatMap(n => n.claimIds || []);

  const allTeaserClaimIds = Array.from(new Set([
    ...(location.teaserClaimIds || []),
    ...nodeClaims
  ]));

  const teaserSourcesHtml = allTeaserClaimIds.length > 0
    ? actionModal.renderSourcesAccordion(allTeaserClaimIds, `📚 Wissenschaftliche Einordnung (${allTeaserClaimIds.length})`, `teaser-${location.id}`)
    : '';

  return `
    <div class="preview-badge badge-teaser">${location.badgeText || 'In Entwicklung'}</div>
    <h3 class="preview-title" id="teaser-title-${location.id}">${location.name}</h3>
    <div class="preview-tagline">${location.tagline}</div>
    <p class="preview-text">${location.teaserText || 'Dieser Ort wird in einer kommenden Version der Psychotherapie-Landkarte begehbar sein.'}</p>
    ${teaserSourcesHtml}
    <div class="preview-actions">
      <button class="btn btn-secondary btn-sm" id="btn-close-teaser">Verstanden</button>
    </div>
  `;
}

export class Application {
  private root: HTMLElement;
  private headerContainer!: HTMLElement;
  private mainViewContainer!: HTMLElement;
  
  private backpackPanel!: BackpackPanel;
  private actionModal!: ActionModal;
  
  private currentLevel: NavigationLevel = 'world';
  private mainWorldView: MainWorldView | null = null;
  private innerAtlasView: InnerAtlasView | null = null;
  private currentSceneView: SceneView | null = null;
  private currentScene: Scene | null = null;

  constructor(customRoot?: HTMLElement) {
    this.root = customRoot || (document.getElementById('app') as HTMLElement);
    if (this.root) {
      this.init();
    }
  }

  private async init(): Promise<void> {
    this.buildBaseDOM();
    this.backpackPanel = new BackpackPanel();
    this.actionModal = new ActionModal();

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

    // Check URL query param to allow direct jump
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (urlParams?.get('level') === 'central' || urlParams?.get('prototype') === 'inner-atlas-v01') {
      this.navigateToLevel('central_atlas');
    } else {
      this.navigateToLevel('world');
    }
  }

  private buildBaseDOM(): void {
    this.root.innerHTML = `
      <!-- App Header with Breadcrumbs -->
      <header class="app-header" id="app-header">
        <div class="header-left" id="header-breadcrumbs"></div>
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

      <!-- Main Stage Container -->
      <main class="app-stage" id="app-stage"></main>
    `;

    this.headerContainer = this.root.querySelector('#header-breadcrumbs') as HTMLElement;
    this.mainViewContainer = this.root.querySelector('#app-stage') as HTMLElement;

    this.root.querySelector('#btn-toggle-backpack')?.addEventListener('click', () => {
      this.backpackPanel.open();
    });
  }

  public navigateToLevel(level: NavigationLevel, targetSceneId?: string): void {
    this.currentLevel = level;
    this.renderHeader();

    this.mainViewContainer.innerHTML = '';

    if (level === 'world') {
      this.renderLevel1World();
    } else if (level === 'central_atlas') {
      this.renderLevel2CentralAtlas();
    } else if (level === 'scene' && targetSceneId) {
      this.renderLevel3Scene(targetSceneId);
    }
  }

  private renderHeader(): void {
    if (!this.headerContainer) return;

    if (this.currentLevel === 'world') {
      this.headerContainer.innerHTML = `
        <div class="brand-badge">
          <span style="font-size: 1.3rem;">🗺️</span>
          <div>
            <div class="brand-title">Landkarte der Psychotherapie</div>
            <div class="brand-subtitle">Ebene 1 • Große Weltkarte der Therapielandschaften</div>
          </div>
        </div>
      `;
    } else if (this.currentLevel === 'central_atlas') {
      this.headerContainer.innerHTML = `
        <button class="btn-zoom-up" id="btn-zoom-to-world" title="Zurück zur Weltkarte">
          <span>⤺</span> <span>Zur Weltkarte</span>
        </button>
        <nav class="breadcrumb-nav">
          <span class="breadcrumb-item" id="bc-world">Weltkarte</span>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-item active">🧭 Zentralregion (37 Schauplätze)</span>
        </nav>
      `;

      this.headerContainer.querySelector('#btn-zoom-to-world')?.addEventListener('click', () => {
        this.navigateToLevel('world');
      });
      this.headerContainer.querySelector('#bc-world')?.addEventListener('click', () => {
        this.navigateToLevel('world');
      });
    } else if (this.currentLevel === 'scene' && this.currentScene) {
      this.headerContainer.innerHTML = `
        <button class="btn-zoom-up" id="btn-zoom-to-central" title="Zurück zur Zentralregion">
          <span>⤺</span> <span>Zur Zentralregion</span>
        </button>
        <nav class="breadcrumb-nav">
          <span class="breadcrumb-item" id="bc-world-from-scene">Weltkarte</span>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-item" id="bc-central-from-scene">Zentralregion</span>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-item active">${this.currentScene.title}</span>
        </nav>
      `;

      this.headerContainer.querySelector('#btn-zoom-to-central')?.addEventListener('click', () => {
        this.navigateToLevel('central_atlas');
      });
      this.headerContainer.querySelector('#bc-central-from-scene')?.addEventListener('click', () => {
        this.navigateToLevel('central_atlas');
      });
      this.headerContainer.querySelector('#bc-world-from-scene')?.addEventListener('click', () => {
        this.navigateToLevel('world');
      });
    }
  }

  private renderLevel1World(): void {
    this.mainWorldView = new MainWorldView({
      container: this.mainViewContainer,
      onEnterCentralRegion: () => {
        this.navigateToLevel('central_atlas');
      }
    });
    this.mainViewContainer.appendChild(this.mainWorldView.getElement());
  }

  private renderLevel2CentralAtlas(): void {
    this.innerAtlasView = new InnerAtlasView({
      container: this.mainViewContainer,
      onEnterActiveScene: (sceneId: string) => {
        this.navigateToLevel('scene', sceneId);
      },
      onBackToProduction: () => {
        this.navigateToLevel('world');
      }
    });
    this.mainViewContainer.appendChild(this.innerAtlasView.getElement());
  }

  private renderLevel3Scene(sceneId: string): void {
    const scene = getSceneById(sceneId);
    if (!scene) return;

    this.currentScene = scene;
    const loc: LocationNode = WORLD_DATA.locations.find(l => l.id === scene.locationId) || {
      id: scene.locationId || sceneId,
      name: scene.title,
      type: 'scene',
      regionId: 'reg_central',
      xPercent: 50,
      yPercent: 50,
      icon: 'landmark',
      tagline: ''
    };

    this.currentSceneView = new SceneView(
      {
        container: this.mainViewContainer,
        scene,
        location: loc,
        regionName: 'Zentralregion',
        onBackToMap: () => {
          this.navigateToLevel('central_atlas');
        }
      },
      this.actionModal
    );

    this.mainViewContainer.appendChild(this.currentSceneView.getElement());
    this.renderHeader();
  }

  private updateBackpackBadge(_state: UserState): void {
    const badge = this.root.querySelector('#backpack-count');
    if (badge) {
      const count = store.getTotalCollectedCount();
      badge.textContent = count.toString();
    }
  }
}

// Auto-boot if app container is present
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const appEl = document.getElementById('app');
    if (appEl) {
      new Application(appEl);
    }
  });
}
