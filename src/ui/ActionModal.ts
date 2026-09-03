import { Hotspot, HotspotAction, Scene, RouteOption, LocationNode } from '../types';
import { store } from '../state/store';
import { toast } from './Toast';
import { getClaimById, getSourcesForClaim, getNodeById } from '../data/knowledge';
import { getExplorationRouteById } from '../data/exploration';
import { renderClaimCardHtml } from './renderers/evidenceRenderer';

export class ActionModal {
  private backdrop: HTMLElement;
  private currentHotspot: Hotspot | null = null;
  private currentScene: Scene | null = null;
  public onNavigateRoute?: (option: RouteOption) => void;

  constructor() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);

    // Close on clicking backdrop
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  }

  public open(hotspot: Hotspot, scene: Scene): void {
    this.currentHotspot = hotspot;
    this.currentScene = scene;

    store.markHotspotInspected(hotspot.id);
    this.render();
    this.backdrop.classList.add('active');
  }

  public openSceneEvidenceModal(scene: Scene, location?: LocationNode): void {
    const nodeIds = location?.knowledgeNodeIds || [];
    const nodes = nodeIds.map(id => getNodeById(id)).filter((n): n is NonNullable<typeof n> => Boolean(n));

    this.backdrop.innerHTML = `
      <div class="dialogue-modal-box scene-evidence-box">
        <div class="dialogue-header">
          <div class="speaker-badge">
            <div class="speaker-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div>
              <div class="speaker-title">Schauplatz-Evidenz & Fachkonzepte</div>
              <div class="speaker-role">${scene.title} • ${location?.tagline || 'Kanonische Wissensknoten'}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" id="btn-close-evidence-modal" title="Schließen (ESC)">✕</button>
        </div>

        <div class="dialogue-content">
          <div class="speech-subtext" style="margin-bottom: 14px;">
            Die folgenden fundierten Fachknoten und wissenschaftlichen Claims sind diesem Schauplatz zugeordnet:
          </div>

          <div class="scene-nodes-list" style="display: flex; flex-direction: column; gap: 14px;">
            ${nodes.map(node => `
              <div class="scene-node-card" style="border: 1px solid var(--border-parchment); border-radius: var(--radius-sm); padding: 12px; background: var(--bg-parchment);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--ink-primary); font-size: 0.95rem;">${node.title}</strong>
                  <span class="claim-type-badge" style="font-size: 0.7rem;">${node.kind}</span>
                </div>
                <div style="font-size: 0.84rem; color: var(--ink-secondary); margin-bottom: 8px;">${node.plainDescription}</div>
                ${this.renderSourcesAccordion(node.claimIds, `Nachweise zu ${node.title} (${node.claimIds.length})`, `node-${node.id}`)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.backdrop.querySelector('#btn-close-evidence-modal')?.addEventListener('click', () => this.close());
    this.attachAccordionListeners(this.backdrop);
    this.backdrop.classList.add('active');
  }

  public close(): void {
    this.backdrop.classList.remove('active');
  }

  private render(): void {
    if (!this.currentHotspot || !this.currentScene) return;

    const h = this.currentHotspot;
    const d = h.dialogue;

    // Collect all relevant claim IDs for this dialogue, including nested quiz and item claims
    const actionClaimIds = d.actions.flatMap(a => {
      const ids = [...(a.claimIds || [])];
      if (a.type === 'QUIZ' && a.quiz.explanationClaimIds) {
        ids.push(...a.quiz.explanationClaimIds);
      }
      if (a.type === 'ITEM' && a.item && a.item.claimIds) {
        ids.push(...a.item.claimIds);
      }
      return ids;
    });

    const allClaimIds = Array.from(new Set([
      ...(d.claimIds || []),
      ...(d.subtextClaimIds || []),
      ...actionClaimIds
    ]));

    this.backdrop.innerHTML = `
      <div class="dialogue-modal-box">
        <div class="dialogue-header">
          <div class="speaker-badge">
            <div class="speaker-avatar">
              ${this.getSpeakerIcon(h.icon)}
            </div>
            <div>
              <div class="speaker-title">${d.speaker || h.title}</div>
              <div class="speaker-role">${d.speakerRole || h.subtitle || this.currentScene.title}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" id="btn-close-dialogue" title="Schließen (ESC)">✕</button>
        </div>

        <div class="dialogue-content">
          <div class="speech-bubble">${d.text}</div>
          ${d.subtext ? `<div class="speech-subtext">${d.subtext}</div>` : ''}

          <!-- Sources & Evidence Section -->
          ${this.renderSourcesAccordion(allClaimIds, undefined, `dialogue-${h.id}`)}

          ${d.actions && d.actions.length > 0 ? `
            <div class="actions-section">
              <div class="actions-section-title">Mögliche Aktionen & Reflexionen</div>
              <div class="actions-list" id="actions-container"></div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.backdrop.querySelector('#btn-close-dialogue')?.addEventListener('click', () => this.close());
    this.attachAccordionListeners(this.backdrop);

    // Render actions
    if (d.actions && d.actions.length > 0) {
      const container = this.backdrop.querySelector('#actions-container');
      if (container) {
        for (const action of d.actions) {
          container.appendChild(this.createActionElement(action));
        }
      }
    }
  }

  /**
   * Bindet Akkordeon-Klickhandler für alle .sources-accordion Elemente innerhalb des Containers
   */
  public attachAccordionListeners(container: HTMLElement): void {
    const accordions = container.querySelectorAll<HTMLElement>('.sources-accordion');
    accordions.forEach(acc => {
      const btn = acc.querySelector<HTMLButtonElement>('.sources-toggle-btn');
      const body = acc.querySelector<HTMLElement>('.sources-body');
      const arrow = acc.querySelector<HTMLElement>('.toggle-arrow');

      if (btn && body && !btn.dataset.hasAccordionListener) {
        btn.dataset.hasAccordionListener = 'true';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = body.classList.toggle('hidden');
          if (arrow) {
            arrow.classList.toggle('rotated', !isHidden);
          }
        });
      }
    });
  }

  public renderSourcesAccordion(claimIds: string[], customTitle?: string, uniquePrefix?: string): string {
    if (!claimIds || claimIds.length === 0) return '';

    const claims = claimIds.map(id => getClaimById(id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
    if (claims.length === 0) return '';

    const title = customTitle || `📚 Wissenschaftliche Einordnung & Quellen (${claims.length})`;
    const prefix = uniquePrefix || `acc-${Math.random().toString(36).substr(2, 6)}`;

    return `
      <div class="sources-accordion" data-accordion-id="${prefix}">
        <button class="sources-toggle-btn" type="button" aria-expanded="false">
          <span>${title}</span>
          <span class="toggle-arrow">▾</span>
        </button>
        <div class="sources-body hidden">
          ${claims.map(claim => {
            const citationsWithSources = getSourcesForClaim(claim);
            return renderClaimCardHtml(claim, citationsWithSources);
          }).join('')}
        </div>
      </div>
    `;
  }

  private createActionElement(action: HotspotAction): HTMLElement {
    if (action.type === 'QUIZ') {
      return this.createQuizElement(action);
    }
    if (action.type === 'NAVIGATE_ROUTES') {
      return this.createRouteSelectionElement(action);
    }

    const el = document.createElement('div');
    el.className = 'action-card-btn';
    el.setAttribute('data-type', action.type);

    const isAlreadyDone = this.checkActionState(action);
    if (isAlreadyDone) {
      el.classList.add('action-done');
    }

    el.innerHTML = `
      <div class="action-icon">${this.getActionIcon(action.type)}</div>
      <div class="action-btn-text">
        <div class="action-btn-title">${action.label}</div>
        ${action.description ? `<div class="action-btn-desc">${action.description}</div>` : ''}
      </div>
      ${isAlreadyDone ? `<div class="action-check-badge">✓ Im Rucksack</div>` : ''}
    `;

    el.addEventListener('click', () => {
      this.handleActionClick(action, el);
    });

    return el;
  }

  private createRouteSelectionElement(action: HotspotAction & { type: 'NAVIGATE_ROUTES' }): HTMLElement {
    const route = getExplorationRouteById(action.routeId);
    const box = document.createElement('div');
    box.className = 'route-exploration-box';

    if (!route) {
      box.textContent = 'Route nicht gefunden.';
      return box;
    }

    const disclaimerSourcesHtml = route.disclaimerClaimIds && route.disclaimerClaimIds.length > 0
      ? this.renderSourcesAccordion(route.disclaimerClaimIds, `📚 Quelleneinordnung zum Orientierungsprinzip`, `disclaimer-${route.id}`)
      : '';

    box.innerHTML = `
      <div class="route-header">
        <div class="route-title">🧭 ${route.prompt}</div>
        <div class="route-disclaimer">${route.disclaimer}</div>
        ${disclaimerSourcesHtml}
      </div>
      <div class="route-options-list">
        ${route.options.map((opt) => {
          const perspectiveSourcesHtml = opt.perspectiveClaimIds && opt.perspectiveClaimIds.length > 0
            ? this.renderSourcesAccordion(opt.perspectiveClaimIds, `📚 Evidenz & Modellkontext dieser Perspektive`, `opt-${opt.id}`)
            : '';

          return `
            <div class="route-option-card" data-option-id="${opt.id}">
              <div class="route-option-label">${opt.label}</div>
              <div class="route-option-desc">${opt.perspectiveDescription}</div>
              ${perspectiveSourcesHtml}
              <button class="btn btn-primary btn-sm btn-select-route" data-option-id="${opt.id}">
                <span>Erkundungsperspektive wählen</span> ➔
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const buttons = box.querySelectorAll('.btn-select-route');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const optId = btn.getAttribute('data-option-id');
        const selectedOpt = route.options.find(o => o.id === optId);
        if (selectedOpt) {
          this.close();
          this.onNavigateRoute?.(selectedOpt);
        }
      });
    });

    this.attachAccordionListeners(box);
    return box;
  }

  private createQuizElement(action: HotspotAction & { type: 'QUIZ' }): HTMLElement {
    const quiz = action.quiz;
    const savedAnswer = store.getQuizAnswer(action.id);
    const box = document.createElement('div');
    box.className = 'quiz-box';

    box.innerHTML = `
      <div class="quiz-question">❓ ${quiz.question}</div>
      <div class="quiz-options">
        ${quiz.options.map((opt, idx) => `
          <button class="quiz-option-btn ${savedAnswer && savedAnswer.selectedOption === idx ? (idx === quiz.correctIndex ? 'selected-correct' : 'selected-wrong') : ''}" 
                  data-idx="${idx}" 
                  ${savedAnswer ? 'disabled' : ''}>
            <span>${['A', 'B', 'C', 'D'][idx]})</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      ${savedAnswer ? `
        <div class="quiz-explanation">
          <strong>${savedAnswer.isCorrect ? '✅ Richtig:' : 'ℹ️ Auflösung:'}</strong> ${quiz.explanation}
        </div>
      ` : ''}
    `;

    if (!savedAnswer) {
      const buttons = box.querySelectorAll('.quiz-option-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIdx = parseInt(btn.getAttribute('data-idx') || '0', 10);
          const isCorrect = selectedIdx === quiz.correctIndex;
          store.recordQuizAnswer(action.id, selectedIdx, isCorrect);
          toast.show(isCorrect ? 'Wissensfrage richtig gelöst!' : 'Wissensfrage beantwortet.');
          this.render();
        });
      });
    }

    return box;
  }

  private checkActionState(action: HotspotAction): boolean {
    if (action.type === 'INTEREST') {
      return store.isInterestSaved(action.id);
    }
    if (action.type === 'ABOUT_ME') {
      return store.isAboutMeSaved(action.id);
    }
    if (action.type === 'BOOKMARK') {
      return store.isBookmarked(action.id);
    }
    if (action.type === 'ITEM' && action.item) {
      return store.hasArtifact(action.item.itemId);
    }
    return false;
  }

  private handleActionClick(action: HotspotAction, _el: HTMLElement): void {
    const scene = this.currentScene!;
    const h = this.currentHotspot!;

    if (action.type === 'INTEREST') {
      if (store.isInterestSaved(action.id)) {
        store.removeInterest(action.id);
        toast.show('Interesse aus dem Rucksack entfernt');
      } else {
        store.saveInterest({
          id: action.id,
          title: h.title,
          note: action.description || action.label,
          originSceneId: scene.id,
          originSceneTitle: scene.title,
          timestamp: Date.now()
        });
        toast.show('In Rucksack: Als interessantes Thema gemerkt!');
      }
      this.render();
    } else if (action.type === 'ABOUT_ME') {
      if (store.isAboutMeSaved(action.id)) {
        store.removeAboutMe(action.id);
        toast.show('Markierung entfernt');
      } else {
        store.saveAboutMe({
          id: action.id,
          statement: action.description || action.label,
          originSceneId: scene.id,
          originSceneTitle: scene.title,
          timestamp: Date.now()
        });
        toast.show('In Rucksack: Unter „Über mich“ gespeichert!');
      }
      this.render();
    } else if (action.type === 'BOOKMARK') {
      if (store.isBookmarked(action.id)) {
        store.removeBookmark(action.id);
        toast.show('Lesezeichen entfernt');
      } else {
        store.addBookmark({
          id: action.id,
          title: h.title,
          summary: action.description || action.label,
          originSceneId: scene.id,
          originSceneTitle: scene.title,
          timestamp: Date.now()
        });
        toast.show('In Rucksack: Für später gemerkt!');
      }
      this.render();
    } else if (action.type === 'ITEM' && action.item) {
      if (!store.hasArtifact(action.item.itemId)) {
        store.collectArtifact({
          id: action.item.itemId,
          title: action.item.title,
          description: action.item.description,
          icon: action.item.icon,
          originSceneId: scene.id,
          originSceneTitle: scene.title,
          timestamp: Date.now()
        });
        toast.show(`Fundstück eingesteckt: ${action.item.title}`);
        this.render();
      }
    }
  }

  private getActionIcon(type: string): string {
    switch (type) {
      case 'INTEREST':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`;
      case 'ABOUT_ME':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      case 'BOOKMARK':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      case 'ITEM':
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m12 8 4 4-4 4M8 12h8"/></svg>`;
      default:
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
  }

  private getSpeakerIcon(_iconName: string): string {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>`;
  }
}
