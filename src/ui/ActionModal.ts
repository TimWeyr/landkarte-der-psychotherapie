import { Hotspot, HotspotAction, Scene, RouteOption, LocationNode } from '../types';
import { store } from '../state/store';
import { toast } from './Toast';
import { getClaimById, getSourcesForClaim, getNodeById } from '../data/knowledge';
import { getExplorationRouteById } from '../data/exploration';
import { renderClaimCardHtml } from './renderers/evidenceRenderer';

export class ActionModal {
  private backdrop: HTMLElement | null = null;
  private currentHotspot: Hotspot | null = null;
  private currentScene: Scene | null = null;
  public onNavigateRoute?: (option: RouteOption) => void;

  constructor() {
    if (typeof document !== 'undefined') {
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
  }

  public open(hotspot: Hotspot, scene: Scene): void {
    if (!this.backdrop && typeof document !== 'undefined') {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop';
      document.body.appendChild(this.backdrop);
    }
    if (!this.backdrop) return;

    this.currentHotspot = hotspot;
    this.currentScene = scene;

    store.markHotspotInspected(hotspot.id);
    this.render();
    this.backdrop.classList.add('active');
  }

  public openSceneEvidenceModal(scene: Scene, location?: LocationNode): void {
    if (!this.backdrop && typeof document !== 'undefined') {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop';
      document.body.appendChild(this.backdrop);
    }
    if (!this.backdrop) return;

    const nodeIds = location?.knowledgeNodeIds || [];
    const nodes = nodeIds.map(id => getNodeById(id)).filter((n): n is NonNullable<typeof n> => Boolean(n));

    this.backdrop.innerHTML = `
      <div class="dialogue-modal-box scene-evidence-box" role="dialog" aria-modal="true" aria-labelledby="modal-title-scene-evidence">
        <div class="dialogue-header">
          <div class="speaker-badge">
            <div class="speaker-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <div>
              <div class="speaker-name" id="modal-title-scene-evidence">Wissenschaftliche Einordnung & Fachkonzepte</div>
              <div class="speaker-role">${scene.title}</div>
            </div>
          </div>
          <button class="btn-close-modal" id="btn-close-scene-evidence" aria-label="Modal schließen">✕</button>
        </div>

        <div class="dialogue-body">
          <p class="scene-evidence-intro">
            Hier sind alle in diesem Schauplatz verankerten psychotherapeutischen Fachkonzepte, Wirkprozesse und ihre wissenschaftlichen Nachweise zusammengefasst:
          </p>

          ${nodes.length > 0 ? nodes.map(node => `
            <div class="scene-node-card">
              <div class="scene-node-header">
                <span class="badge badge-primary">${node.kind}</span>
                <h4>${node.title}</h4>
              </div>
              <p class="scene-node-desc">${node.plainDescription}</p>
              ${node.claimIds.length > 0 ? this.renderSourcesAccordion(node.claimIds, `📚 Evidenz & Nachweise (${node.claimIds.length})`, `node-${node.id}`) : ''}
            </div>
          `).join('') : '<p class="text-muted">Keine gesonderten Wissensknoten für diesen Ort hinterlegt.</p>'}
        </div>

        <div class="dialogue-footer">
          <button class="btn btn-secondary" id="btn-done-scene-evidence">Schließen</button>
        </div>
      </div>
    `;

    this.backdrop.classList.add('active');

    const closeBtn = this.backdrop.querySelector('#btn-close-scene-evidence');
    const doneBtn = this.backdrop.querySelector('#btn-done-scene-evidence');
    const closeHandler = () => this.close();
    closeBtn?.addEventListener('click', closeHandler);
    doneBtn?.addEventListener('click', closeHandler);

    this.attachAccordionListeners(this.backdrop);
  }

  public close(): void {
    if (this.backdrop) {
      this.backdrop.classList.remove('active');
    }
  }

  private render(): void {
    if (!this.currentHotspot || !this.backdrop) return;

    const hotspot = this.currentHotspot;
    const dialogue = hotspot.dialogue;

    // Check if this hotspot has a route navigation action (e.g. Kompasstisch)
    const routeAction = dialogue.actions?.find((a): a is HotspotAction & { type: 'NAVIGATE_ROUTES' } => a.type === 'NAVIGATE_ROUTES');
    if (routeAction && routeAction.routeId) {
      this.renderCompassModal(hotspot, routeAction);
      return;
    }

    const speakerName = dialogue.speaker || hotspot.title;
    const speakerRole = dialogue.speakerRole || 'Schauplatz';

    this.backdrop.innerHTML = `
      <div class="dialogue-modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title-${hotspot.id}">
        <div class="dialogue-header">
          <div class="speaker-badge">
            <div class="speaker-avatar">
              ${this.getSpeakerIcon(hotspot.icon)}
            </div>
            <div>
              <div class="speaker-name" id="modal-title-${hotspot.id}">${speakerName}</div>
              <div class="speaker-role">${speakerRole}</div>
            </div>
          </div>
          <button class="btn-close-modal" id="btn-close-dialogue" aria-label="Dialog schließen">✕</button>
        </div>

        <div class="dialogue-body">
          <div class="dialogue-text">
            ${dialogue.text}
          </div>

          ${this.renderSourcesAccordion(dialogue.claimIds, '📚 Wissenschaftliche Einordnung & Nachweise', `dialogue-${hotspot.id}`)}

          ${dialogue.subtext ? `
            <div class="dialogue-subtext">
              <span class="subtext-icon">💡</span>
              <div class="subtext-content">
                <span>${dialogue.subtext}</span>
                ${this.renderSourcesAccordion(dialogue.subtextClaimIds, '🔍 Nachweise zum Hinweis', `subtext-${hotspot.id}`)}
              </div>
            </div>
          ` : ''}

          <div class="dialogue-actions-list" id="actions-list"></div>
        </div>
      </div>
    `;

    // Close button
    this.backdrop.querySelector('#btn-close-dialogue')?.addEventListener('click', () => {
      this.close();
    });

    // Render actions
    const actionsList = this.backdrop.querySelector('#actions-list');
    if (actionsList && dialogue.actions) {
      for (const action of dialogue.actions) {
        if (action.type === 'QUIZ') {
          actionsList.appendChild(this.createQuizElement(action));
        } else {
          actionsList.appendChild(this.createActionElement(action));
        }
      }
    }

    // Attach accordion click listeners
    this.attachAccordionListeners(this.backdrop);
  }

  private renderCompassModal(hotspot: Hotspot, routeAction: HotspotAction & { type: 'NAVIGATE_ROUTES' }): void {
    if (!this.backdrop) return;
    const route = getExplorationRouteById(routeAction.routeId);
    if (!route) return;

    const disclaimerSourcesHtml = route.disclaimerClaimIds && route.disclaimerClaimIds.length > 0
      ? this.renderSourcesAccordion(route.disclaimerClaimIds, '📚 Quelleneinordnung zum Orientierungsprinzip', 'disclaimer')
      : '';

    this.backdrop.innerHTML = `
      <div class="dialogue-modal-box compass-modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title-compass">
        <div class="dialogue-header">
          <div class="speaker-badge">
            <div class="speaker-avatar">🧭</div>
            <div>
              <div class="speaker-name" id="modal-title-compass">Orientierungskompass</div>
              <div class="speaker-role">5 gleichwertige Erkundungsrichtungen</div>
            </div>
          </div>
          <button class="btn-close-modal" id="btn-close-dialogue" aria-label="Dialog schließen">✕</button>
        </div>

        <div class="dialogue-body">
          <div class="compass-intro-box">
            <div class="compass-situation-badge">Ausgangspunkt</div>
            <h3 class="compass-situation-title">„${route.prompt}“</h3>
            <p class="compass-situation-desc">${route.disclaimer}</p>
            ${disclaimerSourcesHtml}
          </div>

          <div class="compass-instruction">
            Wähle eine Erkundungsrichtung, die dich anspricht, um relevante Arbeitsweisen und Schauplätze auf der Landkarte zu erkunden:
          </div>

          <div class="compass-options-grid route-options-list" id="compass-options-grid">
            ${route.options.map((opt, idx) => `
              <div class="compass-option-card route-option-card" data-opt-index="${idx}" data-option-id="${opt.id}">
                <div class="option-header">
                  <span class="option-number">${idx + 1}</span>
                  <h4 class="option-label">${opt.label}</h4>
                </div>
                <p class="option-summary">${opt.perspectiveDescription}</p>
                ${opt.perspectiveClaimIds && opt.perspectiveClaimIds.length > 0 ? `
                  ${this.renderSourcesAccordion(opt.perspectiveClaimIds, '📚 Evidenz & Nachweise zu dieser Perspektive', `opt-${opt.id}`)}
                ` : ''}
                <div class="option-footer">
                  <button class="btn btn-primary btn-sm btn-select-route" data-opt-index="${idx}" data-option-id="${opt.id}">
                    Diesen Pfad auf der Karte erkunden ➔
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.backdrop.querySelector('#btn-close-dialogue')?.addEventListener('click', () => {
      this.close();
    });

    const optionButtons = this.backdrop.querySelectorAll<HTMLButtonElement>('.btn-select-route');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-opt-index') || '0', 10);
        const selectedOpt = route.options[idx];
        if (selectedOpt) {
          this.close();
          this.onNavigateRoute?.(selectedOpt);
        }
      });
    });

    this.attachAccordionListeners(this.backdrop);
  }

  public renderSourcesAccordion(claimIds?: string[], label = '📚 Wissenschaftliche Einordnung & Nachweise', customId?: string): string {
    if (!claimIds || claimIds.length === 0) return '';

    const claims = claimIds
      .map(id => getClaimById(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    if (claims.length === 0) return '';

    const prefix = customId || `acc-${Math.random().toString(36).slice(2, 7)}`;
    const btnId = `btn-acc-${prefix}`;
    const bodyId = `body-acc-${prefix}`;

    return `
      <div class="sources-accordion" data-accordion-id="${prefix}">
        <button class="sources-toggle-btn" id="${btnId}" type="button" aria-expanded="false" aria-controls="${bodyId}">
          <span class="sources-toggle-label">${label}</span>
          <span class="sources-arrow">▼</span>
        </button>
        <div class="sources-body hidden" id="${bodyId}" role="region" aria-labelledby="${btnId}">
          <div class="sources-list">
            ${claims.map(claim => {
              const citations = getSourcesForClaim(claim);
              return renderClaimCardHtml(claim, citations);
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  public attachAccordionListeners(container: HTMLElement): void {
    const accordions = container.querySelectorAll<HTMLElement>('.sources-accordion');
    accordions.forEach(acc => {
      if (acc.getAttribute('data-has-listener') === 'true') return;
      acc.setAttribute('data-has-listener', 'true');

      const btn = acc.querySelector<HTMLButtonElement>('.sources-toggle-btn');
      const body = acc.querySelector<HTMLElement>('.sources-body');
      const arrow = acc.querySelector<HTMLElement>('.sources-arrow');

      if (btn && body) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isHidden = body.classList.toggle('hidden');
          btn.setAttribute('aria-expanded', (!isHidden).toString());
          if (arrow) {
            arrow.classList.toggle('rotated', !isHidden);
          }
        });
      }
    });
  }

  private createActionElement(action: HotspotAction): HTMLElement {
    const el = document.createElement('div');
    el.className = 'dialogue-action-item';

    const isAlreadyDone = this.checkActionState(action);

    el.innerHTML = `
      <div class="action-icon-wrap">
        ${this.getActionIcon(action.type)}
      </div>
      <div class="action-content">
        <div class="action-label">${action.label}</div>
        ${action.description ? `<div class="action-description">${action.description}</div>` : ''}
      </div>
      ${isAlreadyDone ? `<div class="action-check-badge">✓ Im Rucksack</div>` : ''}
    `;

    el.addEventListener('click', () => {
      this.handleActionClick(action, el);
    });

    return el;
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
