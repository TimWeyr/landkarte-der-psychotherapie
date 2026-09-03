import { store } from '../state/store';
import { downloadStateAsJson, importStateFromJson } from '../state/exporter';
import { toast } from './Toast';

export class SettingsModal {
  private backdrop: HTMLElement;

  constructor() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  }

  public open(): void {
    this.render();
    this.backdrop.classList.add('active');
  }

  public close(): void {
    this.backdrop.classList.remove('active');
  }

  private render(): void {
    this.backdrop.innerHTML = `
      <div class="settings-modal-box">
        <div class="dialogue-header">
          <h2 style="font-size: 1.25rem;">⚙️ Reisedaten & Speicherstand</h2>
          <button class="btn btn-ghost btn-icon" id="btn-close-settings">✕</button>
        </div>

        <div style="padding: 20px 0;">
          <div class="settings-group">
            <h3>💾 Daten exportieren & sichern</h3>
            <p>Lade deinen aktuellen Reisezustand (besuchte Orte, Rucksack-Notizen, Fundstücke) als JSON-Datei herunter.</p>
            <div class="settings-buttons">
              <button class="btn btn-primary" id="btn-download-json">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                JSON herunterladen
              </button>
            </div>
          </div>

          <div class="settings-group">
            <h3>📥 Spielstand importieren</h3>
            <p>Lade eine zuvor exportierte JSON-Datei hoch, um deine Reise an einem anderen Gerät fortzusetzen.</p>
            <div class="settings-buttons">
              <input type="file" id="file-import-json" accept=".json" style="display: none;" />
              <button class="btn btn-secondary" id="btn-trigger-import">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                JSON-Datei auswählen
              </button>
            </div>
          </div>

          <div class="settings-group" style="margin-bottom: 0;">
            <h3 style="color: var(--accent-terracotta);">🔄 Spielstand zurücksetzen</h3>
            <p>Löscht alle gespeicherten Notizen, Fundstücke und Quizantworten im Browser.</p>
            <div class="settings-buttons">
              <button class="btn btn-secondary" id="btn-reset-state" style="color: var(--accent-terracotta); border-color: var(--accent-terracotta);">
                Alles zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.backdrop.querySelector('#btn-close-settings')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-download-json')?.addEventListener('click', () => downloadStateAsJson());

    const fileInput = this.backdrop.querySelector('#file-import-json') as HTMLInputElement;
    const triggerBtn = this.backdrop.querySelector('#btn-trigger-import');

    triggerBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const result = importStateFromJson(content);
          if (result.success) {
            toast.show(result.message);
            this.close();
          } else {
            alert(result.message);
          }
        };
        reader.readAsText(file);
      }
    });

    this.backdrop.querySelector('#btn-reset-state')?.addEventListener('click', () => {
      if (confirm('Möchtest du wirklich alle gesammelten Einträge im Rucksack zurücksetzen?')) {
        store.resetAll();
        toast.show('Reisezustand zurückgesetzt');
        this.close();
      }
    });
  }
}
