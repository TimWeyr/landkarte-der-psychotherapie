import { ONBOARDING_DATA } from '../data/onboarding';
import { store } from '../state/store';

export class IntroScreen {
  private backdrop: HTMLElement;
  private onComplete: () => void;

  constructor(onComplete: () => void) {
    this.onComplete = onComplete;
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.render();
    document.body.appendChild(this.backdrop);
  }

  private render(): void {
    const data = ONBOARDING_DATA;
    this.backdrop.innerHTML = `
      <div class="intro-modal-box">
        <div class="intro-header">
          <h1>${data.title}</h1>
          <div class="intro-subtitle">${data.subtitle}</div>
          <div class="intro-disclaimer">${data.disclaimer}</div>
        </div>

        <div class="intro-points-grid">
          ${data.points.map(pt => `
            <div class="intro-point-card">
              <div class="intro-point-icon">
                ${this.getPointIcon(pt.icon)}
              </div>
              <div class="intro-point-content">
                <h3>${pt.title}</h3>
                <p>${pt.text}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="intro-footer">
          <button class="btn btn-ghost" id="btn-skip-intro">${data.skipButtonText}</button>
          <button class="btn btn-primary" id="btn-start-intro">${data.startButtonText} →</button>
        </div>
      </div>
    `;

    // Event listeners
    const startBtn = this.backdrop.querySelector('#btn-start-intro');
    const skipBtn = this.backdrop.querySelector('#btn-skip-intro');

    startBtn?.addEventListener('click', () => this.close());
    skipBtn?.addEventListener('click', () => this.close());
  }

  private getPointIcon(iconName: string): string {
    if (iconName === 'map-pin') {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
    if (iconName === 'sparkles') {
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
    }
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/><path d="M8 10h8"/></svg>`;
  }

  public show(): void {
    this.backdrop.classList.add('active');
  }

  public close(): void {
    store.setIntroSeen(true);
    this.backdrop.classList.remove('active');
    setTimeout(() => {
      this.backdrop.remove();
      this.onComplete();
    }, 250);
  }
}
