import { MajorTherapeuticRegion } from '../types/worldMap';

export interface RegionOverviewDrawerOptions {
  container: HTMLElement;
  onEnterCentralRegion?: () => void;
  onClose?: () => void;
}

export class RegionOverviewDrawer {
  private element: HTMLElement;
  private options: RegionOverviewDrawerOptions;
  private currentRegion: MajorTherapeuticRegion | null = null;

  constructor(options: RegionOverviewDrawerOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'region-overview-drawer hidden';
    options.container.appendChild(this.element);
  }

  public show(region: MajorTherapeuticRegion): void {
    this.currentRegion = region;
    this.render();
    this.element.classList.remove('hidden');
  }

  public hide(): void {
    this.element.classList.add('hidden');
    this.currentRegion = null;
    this.options.onClose?.();
  }

  private render(): void {
    if (!this.currentRegion) return;
    const r = this.currentRegion;

    this.element.innerHTML = `
      <div class="drawer-inner-card">
        <div class="drawer-header" style="--region-accent: ${r.badgeColor};">
          <div class="header-left">
            <span class="region-badge-pill" style="background-color: ${r.badgeColor};">${r.badgeText}</span>
            <h2 class="region-title">${r.icon} ${r.name}</h2>
            <div class="region-subtitle">${r.subtitle}</div>
          </div>
          <button class="btn-close-drawer" id="btn-close-region-drawer" aria-label="Schließen">✕</button>
        </div>

        <div class="drawer-scroll-body">
          <!-- Landscape Impression -->
          <div class="drawer-section">
            <h4>🗺️ Landschaft & Atmosphäre</h4>
            <p class="section-text">${r.landscapeDescription}</p>
          </div>

          <!-- Core Philosophy -->
          <div class="drawer-section">
            <h4>💡 Therapeutischer Grundgedanke</h4>
            <p class="section-text highlight-box">${r.corePhilosophy}</p>
          </div>

          <!-- Historical Roots -->
          <div class="drawer-section">
            <h4>📜 Historische Wurzeln & Tradition</h4>
            <p class="section-text">${r.historicalRoots}</p>
          </div>

          <!-- Typical Working Modes -->
          <div class="drawer-section">
            <h4>🛠️ Typische Arbeitsweisen & Methoden</h4>
            <ul class="working-modes-list">
              ${r.typicalWorkingModes.map(m => `<li><span>➔</span> ${m}</li>`).join('')}
            </ul>
          </div>

          <!-- What it does not claim -->
          <div class="drawer-section disclaimer-area">
            <h4>⚠️ Was dieser Ansatz nicht behauptet</h4>
            <p class="disclaimer-text">${r.whatItDoesNotClaim}</p>
          </div>

          <!-- Future Sub-Locations Preview -->
          <div class="drawer-section sublocations-area">
            <h4>📍 Schauplätze & Entdeckungspfade in diesem Gebiet</h4>
            <div class="sublocations-tags">
              ${r.futureSubLocations.map(s => `<span class="sublocation-tag">${s}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="drawer-actions">
          ${r.isCentralRegion ? `
            <button class="btn btn-primary btn-enter-major-region" id="btn-enter-central-region">
              🧭 Zentralregion betreten (37 Schauplätze erkunden) ➔
            </button>
          ` : `
            <div class="region-in-prep-notice">
              <span>ℹ️ Dieses Traditionsgebiet befindet sich in kartografischer Vorbereitung. Erkunde vorab die 37 schulenübergreifenden Schauplätze in der Zentralregion.</span>
            </div>
          `}
        </div>
      </div>
    `;

    this.element.querySelector('#btn-close-region-drawer')?.addEventListener('click', () => {
      this.hide();
    });

    this.element.querySelector('#btn-enter-central-region')?.addEventListener('click', () => {
      this.hide();
      this.options.onEnterCentralRegion?.();
    });
  }
}
