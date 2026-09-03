import { MAJOR_REGIONS } from '../data/mainWorldData';
import { MajorTherapeuticRegion } from '../types/worldMap';
import { RegionOverviewDrawer } from './RegionOverviewDrawer';

export interface MainWorldViewOptions {
  container: HTMLElement;
  onEnterCentralRegion: () => void;
}

export class MainWorldView {
  private container: HTMLElement;
  private rootElement: HTMLElement;
  private options: MainWorldViewOptions;
  private drawer: RegionOverviewDrawer;

  // Pan / Zoom State for Level 1
  private scale = 1.0;
  private minScale = 0.6;
  private maxScale = 2.0;
  private pan = { x: 0, y: 0 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private panStart = { x: 0, y: 0 };

  constructor(options: MainWorldViewOptions) {
    this.options = options;
    this.container = options.container;
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'main-world-root';
    this.drawer = new RegionOverviewDrawer({
      container: this.rootElement,
      onEnterCentralRegion: () => this.options.onEnterCentralRegion()
    });
    this.init();
  }

  public getElement(): HTMLElement {
    return this.rootElement;
  }

  private init(): void {
    this.rootElement.innerHTML = `
      <div class="world-viewport" id="world-viewport">
        <div class="world-canvas" id="world-canvas">
          <!-- Level 1 Master Map Background -->
          <img src="/assets/map/world_map_ebene1.jpg" class="world-map-bg" alt="Große Landkarte der Psychotherapie" />

          <!-- Interactive Major Region Anchors -->
          <div class="major-regions-layer" id="major-regions-layer"></div>
        </div>
      </div>

      <!-- Quick Orientation Banner -->
      <div class="world-intro-banner">
        <div class="intro-content">
          <span class="intro-icon">🗺️</span>
          <div>
            <strong>Die Welt der Psychotherapie:</strong> Wähle ein Traditionsgebiet oder starte in der 
            <button class="link-btn-central" id="btn-quick-central">🧭 Zentralregion (37 Schauplätze)</button>.
          </div>
        </div>
      </div>

      <!-- Zoom Controls -->
      <div class="world-zoom-hud">
        <button class="hud-btn" id="btn-world-zoom-in" title="Vergrößern">+</button>
        <button class="hud-btn" id="btn-world-zoom-out" title="Verkleinern">−</button>
        <button class="hud-btn" id="btn-world-zoom-reset" title="Übersicht">⟲</button>
      </div>
    `;

    // Re-attach drawer container
    this.rootElement.appendChild(this.drawer['element']);

    this.renderRegions();
    this.attachEventListeners();
    this.updateTransform();
  }

  private renderRegions(): void {
    const layer = this.rootElement.querySelector('#major-regions-layer');
    if (!layer) return;
    layer.innerHTML = '';

    for (const r of MAJOR_REGIONS) {
      const el = document.createElement('div');
      el.className = `major-region-marker ${r.isCentralRegion ? 'central-beacon' : ''}`;
      el.style.left = `${r.xPercent}%`;
      el.style.top = `${r.yPercent}%`;
      el.setAttribute('data-region-id', r.id);

      el.innerHTML = `
        <div class="region-pin" style="--pin-color: ${r.badgeColor};">
          <span class="region-pin-icon">${r.icon}</span>
          ${r.isCentralRegion ? '<span class="central-glow-ring"></span>' : ''}
        </div>
        <div class="region-tag">
          <span class="tag-title">${r.name}</span>
          <span class="tag-badge" style="background-color: ${r.badgeColor};">${r.badgeText}</span>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.drawer.show(r);
      });

      layer.appendChild(el);
    }
  }

  private attachEventListeners(): void {
    const viewport = this.rootElement.querySelector('#world-viewport') as HTMLElement;
    const btnZoomIn = this.rootElement.querySelector('#btn-world-zoom-in');
    const btnZoomOut = this.rootElement.querySelector('#btn-world-zoom-out');
    const btnZoomReset = this.rootElement.querySelector('#btn-world-zoom-reset');
    const btnQuickCentral = this.rootElement.querySelector('#btn-quick-central');

    btnQuickCentral?.addEventListener('click', () => {
      this.options.onEnterCentralRegion();
    });

    btnZoomIn?.addEventListener('click', () => this.zoom(0.15));
    btnZoomOut?.addEventListener('click', () => this.zoom(-0.15));
    btnZoomReset?.addEventListener('click', () => {
      this.scale = 1.0;
      this.pan = { x: 0, y: 0 };
      this.updateTransform();
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
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      this.zoom(delta);
    }, { passive: false });
  }

  private zoom(delta: number): void {
    this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
    this.updateTransform();
  }

  private updateTransform(): void {
    const canvas = this.rootElement.querySelector('#world-canvas') as HTMLElement;
    if (canvas) {
      canvas.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
    }
  }
}
