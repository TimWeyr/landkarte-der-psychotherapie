import { ATLAS_LOCATIONS, AtlasLocation } from '../data/atlasLocations';
import { ATLAS_EDGES } from '../data/atlasEdges';
import { ATLAS_ROUTES, AtlasRoute } from '../data/atlasRoutes';

export interface InnerAtlasViewOptions {
  container: HTMLElement;
  onEnterActiveScene?: (sceneId: string) => void;
  onBackToProduction?: () => void;
}

export class InnerAtlasView {
  private container: HTMLElement;
  private rootElement: HTMLElement;
  private options: InnerAtlasViewOptions;
  private selectedLocation: AtlasLocation | null = null;
  private activeRoute: AtlasRoute | null = null;
  private hoveredLocation: AtlasLocation | null = null;

  // Pan / Zoom State
  private scale = 1.0;
  private minScale = 0.5;
  private maxScale = 2.2;
  private pan = { x: 0, y: 0 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private panStart = { x: 0, y: 0 };

  constructor(options: InnerAtlasViewOptions) {
    this.options = options;
    this.container = options.container;
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'inner-atlas-root';
    this.init();
  }

  public getElement(): HTMLElement {
    return this.rootElement;
  }

  private init(): void {
    this.rootElement.innerHTML = `
      <div class="atlas-header">
        <div class="atlas-title-group">
          <span class="atlas-badge">PROTOTYP V0.1</span>
          <h1 class="atlas-title">Innerer Psychotherapie-Atlas (37 Schauplätze)</h1>
        </div>
        <div class="atlas-header-actions">
          <button class="btn btn-sm btn-crisis" id="btn-atlas-crisis" title="Sofortige Notfallhilfe">
            🚨 Krisenwache (Notfall)
          </button>
          <button class="btn btn-sm btn-secondary" id="btn-back-to-prod">
            Zurück zur Standardkarte
          </button>
        </div>
      </div>

      <!-- Route Filter Bar -->
      <div class="atlas-route-bar">
        <span class="route-bar-label">🧭 Erkundungsrouten:</span>
        <button class="route-pill active" data-route-id="all">Alle 37 Orte</button>
        ${ATLAS_ROUTES.map(r => `
          <button class="route-pill" data-route-id="${r.id}" style="--route-color: ${r.color}">
            ${r.name}
          </button>
        `).join('')}
      </div>

      <!-- Map Viewport -->
      <div class="atlas-viewport" id="atlas-viewport">
        <div class="atlas-world" id="atlas-world">
          <!-- Background Map Raster -->
          <img src="/assets/prototypes/inner-atlas-v01/map/inner_atlas_world.jpg" class="atlas-map-bg" alt="Innerer Atlas Landkarte" />

          <!-- SVG Overlay for Edges and Regions -->
          <svg class="atlas-svg-layer" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <g id="edges-group"></g>
          </svg>

          <!-- Landscape Region Labels -->
          <div class="landscape-labels-layer">
            <div class="landscape-tag" style="left: 60%; top: 12%;">🌦️ Wetter des Erlebens</div>
            <div class="landscape-tag" style="left: 32%; top: 48%;">🌱 Bedürfnisse & Ressourcen</div>
            <div class="landscape-tag" style="left: 20%; top: 22%;">📜 Lebensgeschichte & Muster</div>
            <div class="landscape-tag" style="left: 76%; top: 42%;">⚙️ Veränderungsprozesse</div>
            <div class="landscape-tag" style="left: 24%; top: 72%;">🤝 Beziehung & Kontext</div>
            <div class="landscape-tag" style="left: 56%; top: 78%;">🧭 Orientierung & Sicherheit</div>
          </div>

          <!-- Interactive Landmarks Layer -->
          <div class="landmarks-layer" id="landmarks-layer"></div>
        </div>
      </div>

      <!-- Location Preview Card Drawer / Modal -->
      <div class="atlas-preview-drawer hidden" id="atlas-preview-drawer">
        <div class="drawer-content" id="drawer-content"></div>
      </div>

      <!-- Zoom Controls HUD -->
      <div class="atlas-zoom-hud">
        <button class="hud-btn" id="btn-zoom-in" title="Vergrößern">+</button>
        <button class="hud-btn" id="btn-zoom-out" title="Verkleinern">−</button>
        <button class="hud-btn" id="btn-zoom-reset" title="Gesamtansicht">⟲</button>
      </div>
    `;

    this.attachEventListeners();
    this.renderLandmarks();
    this.renderEdges();
    this.updateTransform();
  }

  private attachEventListeners(): void {
    const viewport = this.rootElement.querySelector('#atlas-viewport') as HTMLElement;
    const btnBack = this.rootElement.querySelector('#btn-back-to-prod');
    const btnCrisis = this.rootElement.querySelector('#btn-atlas-crisis');
    const btnZoomIn = this.rootElement.querySelector('#btn-zoom-in');
    const btnZoomOut = this.rootElement.querySelector('#btn-zoom-out');
    const btnZoomReset = this.rootElement.querySelector('#btn-zoom-reset');

    btnBack?.addEventListener('click', () => {
      this.options.onBackToProduction?.();
    });

    btnCrisis?.addEventListener('click', () => {
      const crisisLoc = ATLAS_LOCATIONS.find(l => l.id === 'loc_crisis_watch');
      if (crisisLoc) this.selectLocation(crisisLoc);
    });

    btnZoomIn?.addEventListener('click', () => this.zoom(0.2));
    btnZoomOut?.addEventListener('click', () => this.zoom(-0.2));
    btnZoomReset?.addEventListener('click', () => {
      this.scale = 1.0;
      this.pan = { x: 0, y: 0 };
      this.updateTransform();
    });

    // Route selector pills
    const pills = this.rootElement.querySelectorAll<HTMLButtonElement>('.route-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const routeId = pill.getAttribute('data-route-id');
        if (routeId === 'all') {
          this.activeRoute = null;
        } else {
          this.activeRoute = ATLAS_ROUTES.find(r => r.id === routeId) || null;
        }
        this.renderLandmarks();
        this.renderEdges();
      });
    });

    // Pan & Drag Handlers
    viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.panStart = { x: this.pan.x, y: this.pan.y };
      viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.pan = {
        x: this.panStart.x + dx,
        y: this.panStart.y + dy
      };
      this.updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        viewport.style.cursor = 'grab';
      }
    });

    // Wheel Zoom
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom(delta);
    }, { passive: false });
  }

  private zoom(delta: number): void {
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
    this.scale = newScale;
    this.updateTransform();
  }

  private updateTransform(): void {
    const world = this.rootElement.querySelector('#atlas-world') as HTMLElement;
    if (world) {
      world.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    }

    // Semantic zoom class toggles
    if (this.scale < 0.8) {
      this.rootElement.classList.add('zoom-level-overview');
      this.rootElement.classList.remove('zoom-level-regional', 'zoom-level-detail');
    } else if (this.scale < 1.4) {
      this.rootElement.classList.add('zoom-level-regional');
      this.rootElement.classList.remove('zoom-level-overview', 'zoom-level-detail');
    } else {
      this.rootElement.classList.add('zoom-level-detail');
      this.rootElement.classList.remove('zoom-level-overview', 'zoom-level-regional');
    }
  }

  private renderLandmarks(): void {
    const layer = this.rootElement.querySelector('#landmarks-layer');
    if (!layer) return;
    layer.innerHTML = '';

    for (const loc of ATLAS_LOCATIONS) {
      const isRouteMember = !this.activeRoute || this.activeRoute.locationIds.includes(loc.id);
      const isSelected = this.selectedLocation?.id === loc.id;
      const isNeighbor = this.selectedLocation?.directNeighborIds.includes(loc.id);

      const el = document.createElement('div');
      el.className = `atlas-landmark ${loc.type} ${isRouteMember ? 'in-route' : 'faded'} ${isSelected ? 'selected' : ''} ${isNeighbor ? 'neighbor-highlight' : ''}`;
      el.style.left = `${loc.xPercent}%`;
      el.style.top = `${loc.yPercent}%`;

      el.innerHTML = `
        <div class="landmark-pin" title="${loc.name}">
          <img src="${loc.landmarkIconSrc}" class="landmark-icon" alt="${loc.name}" />
          ${loc.type === 'scene_active' ? '<span class="active-pulse-badge">★</span>' : ''}
        </div>
        <div class="landmark-label">${loc.name}</div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectLocation(loc);
      });

      el.addEventListener('mouseenter', () => {
        this.hoveredLocation = loc;
      });

      el.addEventListener('mouseleave', () => {
        this.hoveredLocation = null;
      });

      layer.appendChild(el);
    }
  }

  private renderEdges(): void {
    const group = this.rootElement.querySelector('#edges-group');
    if (!group) return;
    group.innerHTML = '';

    for (const edge of ATLAS_EDGES) {
      const fromLoc = ATLAS_LOCATIONS.find(l => l.id === edge.fromLocationId);
      const toLoc = ATLAS_LOCATIONS.find(l => l.id === edge.toLocationId);
      if (!fromLoc || !toLoc) continue;

      const isRouteActive = this.activeRoute && 
        this.activeRoute.locationIds.includes(fromLoc.id) && 
        this.activeRoute.locationIds.includes(toLoc.id);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${fromLoc.xPercent * 10}`);
      line.setAttribute('y1', `${fromLoc.yPercent * 10}`);
      line.setAttribute('x2', `${toLoc.xPercent * 10}`);
      line.setAttribute('y2', `${toLoc.yPercent * 10}`);
      line.setAttribute('class', `atlas-edge ${edge.pathKind} ${isRouteActive ? 'route-highlight' : ''}`);

      group.appendChild(line);
    }
  }

  public selectLocation(loc: AtlasLocation): void {
    this.selectedLocation = loc;
    this.renderLandmarks();
    this.renderEdges();
    this.renderPreviewDrawer(loc);
  }

  private renderPreviewDrawer(loc: AtlasLocation): void {
    const drawer = this.rootElement.querySelector('#atlas-preview-drawer') as HTMLElement;
    const content = this.rootElement.querySelector('#drawer-content') as HTMLElement;
    if (!drawer || !content) return;

    const neighbors = loc.directNeighborIds
      .map(id => ATLAS_LOCATIONS.find(l => l.id === id))
      .filter((n): n is AtlasLocation => Boolean(n));

    content.innerHTML = `
      <div class="drawer-header">
        <div>
          <span class="drawer-landscape-badge">${loc.landscape}</span>
          <h2 class="drawer-title">${loc.name}</h2>
        </div>
        <button class="btn-close-drawer" id="btn-close-drawer" aria-label="Vorschau schließen">✕</button>
      </div>

      <div class="drawer-body">
        <!-- Scene Concept Image -->
        <div class="drawer-concept-box">
          <img src="${loc.sceneConceptSrc}" alt="${loc.name} Konzept" class="drawer-concept-img" />
          <div class="concept-caption">🎨 Szenen-Konzeptbild (960×540 • ${loc.type === 'scene_active' ? 'Produktionsszene' : 'Entwurf'})</div>
        </div>

        <!-- User Core Question -->
        <div class="drawer-question-box">
          <span class="question-icon">💬</span>
          <div class="question-text">„${loc.userQuestion}“</div>
        </div>

        <!-- Topic Description -->
        <div class="drawer-section">
          <h4>Themenschwerpunkt</h4>
          <p class="drawer-desc">${loc.themeSummary}</p>
        </div>

        <!-- What this place does not claim -->
        <div class="drawer-disclaimer-box">
          <strong>⚠️ Was dieser Ort nicht behauptet:</strong>
          <p>${loc.whatItDoesNotClaim}</p>
        </div>

        <!-- Neighbors / Weiterwege -->
        <div class="drawer-section">
          <h4>Mögliche Weiterwege (Nachbarschaften)</h4>
          <div class="drawer-neighbors-list">
            ${neighbors.map(n => `
              <button class="neighbor-btn" data-neighbor-id="${n.id}">
                ➔ ${n.name} <span class="neighbor-landscape">(${n.landscape})</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        ${loc.type === 'scene_active' && loc.implementedSceneId ? `
          <button class="btn btn-primary btn-enter-scene" id="btn-enter-scene">
            Ort betreten (${loc.name}) ➔
          </button>
        ` : `
          <div class="concept-draft-notice">
            <span>ℹ️ Dieser Schauplatz ist als Konzeptentwurf (concept-draft) im Atlas verortet.</span>
          </div>
        `}
      </div>
    `;

    drawer.classList.remove('hidden');

    content.querySelector('#btn-close-drawer')?.addEventListener('click', () => {
      drawer.classList.add('hidden');
      this.selectedLocation = null;
      this.renderLandmarks();
      this.renderEdges();
    });

    content.querySelectorAll<HTMLButtonElement>('.neighbor-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-neighbor-id');
        const nextLoc = ATLAS_LOCATIONS.find(l => l.id === id);
        if (nextLoc) this.selectLocation(nextLoc);
      });
    });

    content.querySelector('#btn-enter-scene')?.addEventListener('click', () => {
      if (loc.implementedSceneId) {
        this.options.onEnterActiveScene?.(loc.implementedSceneId);
      }
    });
  }
}
