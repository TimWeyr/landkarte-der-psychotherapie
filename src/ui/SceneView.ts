import { Scene, Hotspot, LocationNode } from '../types';
import { store } from '../state/store';
import { ActionModal } from './ActionModal';

export interface SceneViewOptions {
  container: HTMLElement;
  scene: Scene;
  location?: LocationNode;
  regionName?: string;
  onBackToMap: () => void;
  onRouteNavigate?: (option: import('../types').RouteOption) => void;
}

export class SceneView {
  private options: SceneViewOptions;
  private actionModal: ActionModal;
  private element: HTMLElement;
  private unsubscribeStore?: () => void;

  constructor(options: SceneViewOptions, actionModal: ActionModal) {
    this.options = options;
    this.actionModal = actionModal;
    this.actionModal.onNavigateRoute = (opt) => {
      this.options.onRouteNavigate?.(opt);
    };
    this.element = document.createElement('div');
    this.element.className = 'scene-view-container';
    this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private render(): void {
    const scene = this.options.scene;
    const location = this.options.location;

    // Mark as visited in user state
    store.markLocationVisited(scene.locationId);

    this.element.innerHTML = `
      <div class="scene-hud">
        <!-- Header is unified cleanly in top app-header -->
      </div>

      <div class="scene-viewport">
        <img class="scene-background" src="${scene.imageSrc}" alt="${scene.title}" draggable="false" />
        <div class="scene-hotspots-layer" id="hotspots-layer"></div>
      </div>

      <div class="scene-bottom-bar">
        <div class="scene-hint">
          ✨ Tippe auf die leuchtenden Punkte, um Schauplätze und Dialoge zu erkunden.
        </div>
        ${location?.knowledgeNodeIds && location.knowledgeNodeIds.length > 0 ? `
          <button class="btn btn-secondary btn-sm btn-scene-evidence" id="btn-scene-evidence" title="Wissenschaftliche Einordnung & Fachkonzepte dieses Schauplatzes">
            <span>📚 Schauplatz-Evidenz (${location.knowledgeNodeIds.length})</span>
          </button>
        ` : ''}
      </div>

      <!-- Bottom Right Compass / Back to Map Button (Option A) -->
      <button class="btn-scene-back-compass" id="btn-compass-back" title="Zurück zur Weltkarte (oder Taste M / ESC drücken)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
        <span>Zurück zur Karte</span>
      </button>
    `;

    // Compass back button
    this.element.querySelector('#btn-compass-back')?.addEventListener('click', () => {
      this.options.onBackToMap();
    });

    // Scene Evidence button
    this.element.querySelector('#btn-scene-evidence')?.addEventListener('click', () => {
      this.actionModal.openSceneEvidenceModal(scene, location);
    });

    // Subscribe to store updates to reflect inspected/completed states live
    this.unsubscribeStore = store.subscribe(() => {
      this.updateHotspotsState();
    });

    // Initial render of Hotspots
    this.renderHotspots();
  }

  private renderHotspots(): void {
    const layer = this.element.querySelector('#hotspots-layer');
    if (layer) {
      layer.innerHTML = '';
      for (const hotspot of this.options.scene.hotspots) {
        layer.appendChild(this.createHotspotElement(hotspot));
      }
    }
  }

  private updateHotspotsState(): void {
    const markers = this.element.querySelectorAll<HTMLElement>('.hotspot-marker');
    markers.forEach(marker => {
      const hotspotId = marker.getAttribute('data-hotspot-id');
      if (!hotspotId) return;

      const hotspot = this.options.scene.hotspots.find(h => h.id === hotspotId);
      if (!hotspot) return;

      const state = store.getState();
      const isInspected = state.inspectedHotspots.includes(hotspot.id);
      const isCompleted = this.checkHotspotCompleted(hotspot, state);

      marker.classList.toggle('hotspot-unvisited', !isInspected);
      marker.classList.toggle('hotspot-visited', isInspected);
      marker.classList.toggle('hotspot-completed', isCompleted);

      // Update check badge
      let badge = marker.querySelector('.hotspot-check-badge');
      if (isCompleted && !badge) {
        const pin = marker.querySelector('.hotspot-pin');
        if (pin) {
          const badgeEl = document.createElement('div');
          badgeEl.className = 'hotspot-check-badge';
          badgeEl.textContent = '✓';
          pin.appendChild(badgeEl);
        }
      } else if (!isCompleted && badge) {
        badge.remove();
      }
    });
  }

  private checkHotspotCompleted(hotspot: Hotspot, state: import('../types').UserState): boolean {
    const actions = hotspot.dialogue.actions || [];
    if (actions.length === 0) return state.inspectedHotspots.includes(hotspot.id);

    // Check if at least one meaningful action (item collected, quiz answered, interest/about-me/bookmark) has been taken
    return actions.some(act => {
      if (act.type === 'ITEM' && act.item) return store.hasArtifact(act.item.itemId);
      if (act.type === 'QUIZ') return Boolean(store.getQuizAnswer(act.id));
      if (act.type === 'INTEREST') return store.isInterestSaved(act.id);
      if (act.type === 'ABOUT_ME') return store.isAboutMeSaved(act.id);
      if (act.type === 'BOOKMARK') return store.isBookmarked(act.id);
      return false;
    });
  }

  private createHotspotElement(hotspot: Hotspot): HTMLElement {
    const el = document.createElement('button');
    el.setAttribute('data-hotspot-id', hotspot.id);
    
    const state = store.getState();
    const isInspected = state.inspectedHotspots.includes(hotspot.id);
    const isCompleted = this.checkHotspotCompleted(hotspot, state);

    el.className = `hotspot-marker ${isInspected ? 'hotspot-visited' : 'hotspot-unvisited'} ${isCompleted ? 'hotspot-completed' : ''}`;
    el.style.left = `${hotspot.xPercent}%`;
    el.style.top = `${hotspot.yPercent}%`;
    if (hotspot.zIndex) el.style.zIndex = `${hotspot.zIndex}`;
    el.setAttribute('aria-label', hotspot.title);

    el.innerHTML = `
      <div class="hotspot-pin">
        ${this.getHotspotIcon(hotspot.icon)}
        ${isCompleted ? '<div class="hotspot-check-badge">✓</div>' : ''}
      </div>
      <div class="hotspot-label">${hotspot.title}</div>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.actionModal.open(hotspot, this.options.scene);
    });

    return el;
  }

  private getHotspotIcon(iconName: string): string {
    switch (iconName) {
      case 'telescope':
      case 'eye':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12c2.5-4 6-6 10-6s7.5 2 10 6c-2.5 4-6 6-10 6s-7.5-2-10-6Z"/></svg>`;
      case 'file-text':
      case 'clipboard-list':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
      case 'book-open':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
      case 'user':
      case 'message-circle':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      case 'clock':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
      case 'map':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
  }

  public destroy(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    this.element.remove();
  }
}
