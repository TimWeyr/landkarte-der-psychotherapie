import { UserState } from '../types';
import { store } from '../state/store';
import { downloadStateAsJson } from '../state/exporter';
import { SettingsModal } from './SettingsModal';

export class BackpackPanel {
  private modalEl: HTMLElement;
  private settingsModal: SettingsModal;

  constructor() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'backpack-modal';
    this.settingsModal = new SettingsModal();
    document.body.appendChild(this.modalEl);

    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    // Subscribe to state changes to update backpack view in real time
    store.subscribe((state) => {
      if (this.modalEl.classList.contains('active')) {
        this.render(state);
      }
    });
  }

  public open(): void {
    const state = store.getState();
    this.render(state);
    this.modalEl.classList.add('active');
  }

  public close(): void {
    this.modalEl.classList.remove('active');
  }

  private render(state: UserState): void {
    const totalCollected = store.getTotalCollectedCount();
    const quizSolvedCount = Object.keys(state.quizAnswers).length;

    this.modalEl.innerHTML = `
      <div class="backpack-container">
        <div class="backpack-header">
          <div class="backpack-title-group">
            <div class="backpack-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/>
                <path d="M8 10h8"/>
              </svg>
            </div>
            <div>
              <h2>Mein Reiserucksack</h2>
              <p>${totalCollected} Einträge gesammelt • Lokal im Browser gespeichert</p>
            </div>
          </div>

          <div class="backpack-actions">
            <button class="btn btn-secondary" id="btn-export-json" title="Reise als JSON sichern">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportieren
            </button>
            <button class="btn btn-secondary" id="btn-open-settings" title="Einstellungen, Import & Reset">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button class="btn btn-ghost btn-icon" id="btn-close-backpack" title="Schließen">✕</button>
          </div>
        </div>

        <div class="backpack-body">
          <!-- Spalte 1: Entdeckt -->
          <div class="backpack-column">
            <div class="column-header">
              <h3><span>📍</span> Entdeckt</h3>
              <span class="column-badge">${state.visitedLocations.length + state.artifacts.length + quizSolvedCount}</span>
            </div>
            <div class="column-list">
              ${this.renderDiscoveredSection(state)}
            </div>
          </div>

          <!-- Spalte 2: Über mich -->
          <div class="backpack-column">
            <div class="column-header">
              <h3><span>👤</span> Über mich</h3>
              <span class="column-badge">${state.aboutMeMarks.length}</span>
            </div>
            <div class="column-list">
              ${this.renderAboutMeSection(state)}
            </div>
          </div>

          <!-- Spalte 3: Für später -->
          <div class="backpack-column">
            <div class="column-header">
              <h3><span>📌</span> Für später</h3>
              <span class="column-badge">${state.bookmarks.length + state.interests.length}</span>
            </div>
            <div class="column-list">
              ${this.renderBookmarksSection(state)}
            </div>
          </div>
        </div>

        <div class="backpack-footer">
          <div>💡 <em>Tipp: Alle Markierungen können jederzeit mit dem ✕ entfernt werden.</em></div>
          <div>Schema-Version: ${state.schemaVersion}</div>
        </div>
      </div>
    `;

    // Bind events
    this.modalEl.querySelector('#btn-close-backpack')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-export-json')?.addEventListener('click', () => downloadStateAsJson());
    this.modalEl.querySelector('#btn-open-settings')?.addEventListener('click', () => this.settingsModal.open());

    // Bind card delete buttons
    this.modalEl.querySelectorAll('.btn-del-aboutme').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) store.removeAboutMe(id);
      });
    });

    this.modalEl.querySelectorAll('.btn-del-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) store.removeBookmark(id);
      });
    });

    this.modalEl.querySelectorAll('.btn-del-interest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) store.removeInterest(id);
      });
    });
  }

  private renderDiscoveredSection(state: UserState): string {
    const hasItems = state.artifacts.length > 0 || state.visitedLocations.length > 0;
    if (!hasItems) {
      return `
        <div class="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <p>Noch keine Fundstücke eingesammelt. Erkunde den Leuchtturm und den Bahnhof!</p>
        </div>
      `;
    }

    let html = '';

    // Visited locations
    if (state.visitedLocations.length > 0) {
      html += `
        <div class="backpack-card card-artifact">
          <div class="card-origin">Reise-Fortschritt</div>
          <div class="card-title">Besuchte Schauplätze (${state.visitedLocations.length})</div>
          <div class="card-desc">${state.visitedLocations.map(loc => loc === 'loc_lighthouse' ? 'Leuchtturm der Evidenz' : loc === 'loc_station' ? 'Bahnhof der Versorgung' : loc).join(' • ')}</div>
        </div>
      `;
    }

    // Collected Artifacts
    for (const art of state.artifacts) {
      html += `
        <div class="backpack-card card-artifact">
          <div class="card-origin">Fundstück aus: ${art.originSceneTitle}</div>
          <div class="card-title">💎 ${art.title}</div>
          <div class="card-desc">${art.description}</div>
        </div>
      `;
    }

    // Quiz answers solved
    const quizCount = Object.keys(state.quizAnswers).length;
    if (quizCount > 0) {
      html += `
        <div class="backpack-card card-artifact">
          <div class="card-origin">Wissensprüfungen</div>
          <div class="card-title">✅ ${quizCount} Wissensfragen gelöst</div>
          <div class="card-desc">Fragen im Logbuch und am Auskunftsschalter erfolgreich bearbeitet.</div>
        </div>
      `;
    }

    return html;
  }

  private renderAboutMeSection(state: UserState): string {
    if (state.aboutMeMarks.length === 0) {
      return `
        <div class="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <p>Hier erscheinen Gedanken und Orientierungsbedarfe, die du mit „Das beschreibt etwas von mir“ markierst.</p>
        </div>
      `;
    }

    return state.aboutMeMarks.map(item => `
      <div class="backpack-card card-about-me">
        <button class="card-delete-btn btn-del-aboutme" data-id="${item.id}" title="Entfernen">✕</button>
        <div class="card-origin">Aus: ${item.originSceneTitle}</div>
        <div class="card-title">🌱 ${item.statement}</div>
      </div>
    `).join('');
  }

  private renderBookmarksSection(state: UserState): string {
    const total = state.bookmarks.length + state.interests.length;
    if (total === 0) {
      return `
        <div class="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <p>Hier speicherst du Themen für später oder markierst Punkte mit „Das interessiert mich“.</p>
        </div>
      `;
    }

    let html = '';

    for (const b of state.bookmarks) {
      html += `
        <div class="backpack-card card-bookmark">
          <button class="card-delete-btn btn-del-bookmark" data-id="${b.id}" title="Entfernen">✕</button>
          <div class="card-origin">Lesezeichen • ${b.originSceneTitle}</div>
          <div class="card-title">📌 ${b.title}</div>
          <div class="card-desc">${b.summary}</div>
        </div>
      `;
    }

    for (const i of state.interests) {
      html += `
        <div class="backpack-card card-interest">
          <button class="card-delete-btn btn-del-interest" data-id="${i.id}" title="Entfernen">✕</button>
          <div class="card-origin">Interesse • ${i.originSceneTitle}</div>
          <div class="card-title">🔍 ${i.title}</div>
          <div class="card-desc">${i.note}</div>
        </div>
      `;
    }

    return html;
  }
}
