import { store } from './store';
import { parseImportedState } from './storage';

export function downloadStateAsJson(): void {
  const state = store.getState();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `psychotherapie-reise-stand_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importStateFromJson(jsonString: string): { success: boolean; message: string } {
  const { result, status } = parseImportedState(jsonString);
  if (status.success && result) {
    store.replaceState(result);
    return { success: true, message: status.message };
  } else {
    return { success: false, message: status.message };
  }
}
