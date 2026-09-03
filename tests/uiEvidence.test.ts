import { describe, it, expect, beforeEach } from 'vitest';
import { ActionModal } from '../src/ui/ActionModal';
import { SceneView } from '../src/ui/SceneView';
import { lighthouseScene } from '../src/data/scenes/lighthouse';
import { WORLD_DATA } from '../src/data/worldData';
import { renderTeaserCardHtml } from '../src/main';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';

describe('UI Evidence Modals, ARIA Attributes & Accordion Interaction Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    store.replaceState(getDefaultState());
  });

  it('should render and toggle disclaimer and perspective accordions in Compass Modal via public ActionModal.open()', () => {
    const modal = new ActionModal();
    const compassHotspot = lighthouseScene.hotspots.find(h => h.id === 'lh_compass_desk')!;

    // Open modal via public method
    modal.open(compassHotspot, lighthouseScene);

    const modalBox = document.querySelector('.compass-modal-box');
    expect(modalBox).not.toBeNull();
    expect(modalBox?.getAttribute('role')).toBe('dialog');
    expect(modalBox?.getAttribute('aria-modal')).toBe('true');
    expect(modalBox?.getAttribute('aria-labelledby')).toBe('modal-title-compass');

    // 1. Disclaimer Accordion Interaction
    const disclaimerAccordion = document.querySelector('.compass-intro-box .sources-accordion');
    expect(disclaimerAccordion).not.toBeNull();

    const disclaimerBtn = disclaimerAccordion?.querySelector<HTMLButtonElement>('.sources-toggle-btn')!;
    const disclaimerBody = disclaimerAccordion?.querySelector<HTMLElement>('.sources-body')!;

    expect(disclaimerBtn.getAttribute('aria-expanded')).toBe('false');
    expect(disclaimerBody.classList.contains('hidden')).toBe(true);
    expect(disclaimerBtn.getAttribute('aria-controls')).toBe(disclaimerBody.id);

    // Click to expand
    disclaimerBtn.click();
    expect(disclaimerBtn.getAttribute('aria-expanded')).toBe('true');
    expect(disclaimerBody.classList.contains('hidden')).toBe(false);

    // Click to collapse
    disclaimerBtn.click();
    expect(disclaimerBtn.getAttribute('aria-expanded')).toBe('false');
    expect(disclaimerBody.classList.contains('hidden')).toBe(true);

    // 2. Perspective Accordion Interaction (Option 1)
    const option1Accordion = document.querySelector('.route-option-card[data-option-id="opt_concrete_action"] .sources-accordion');
    expect(option1Accordion).not.toBeNull();

    const optBtn = option1Accordion?.querySelector<HTMLButtonElement>('.sources-toggle-btn')!;
    const optBody = option1Accordion?.querySelector<HTMLElement>('.sources-body')!;

    expect(optBtn.getAttribute('aria-expanded')).toBe('false');
    expect(optBody.classList.contains('hidden')).toBe(true);

    // Click to expand
    optBtn.click();
    expect(optBtn.getAttribute('aria-expanded')).toBe('true');
    expect(optBody.classList.contains('hidden')).toBe(false);

    // Click to collapse
    optBtn.click();
    expect(optBtn.getAttribute('aria-expanded')).toBe('false');
    expect(optBody.classList.contains('hidden')).toBe(true);
  });

  it('should render and open Scene Evidence Modal with proper ARIA attributes via SceneView button', () => {
    const actionModal = new ActionModal();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const lighthouseLoc = WORLD_DATA.locations.find(l => l.id === 'loc_lighthouse')!;

    const sceneView = new SceneView(
      {
        container,
        scene: lighthouseScene,
        location: lighthouseLoc,
        regionName: 'Zentralregion',
        onBackToMap: () => {}
      },
      actionModal
    );

    container.appendChild(sceneView.getElement());

    const evidenceBtn = sceneView.getElement().querySelector<HTMLButtonElement>('#btn-scene-evidence')!;
    expect(evidenceBtn).not.toBeNull();

    // Click scene evidence button
    evidenceBtn.click();

    const evidenceModal = document.querySelector('.scene-evidence-box');
    expect(evidenceModal).not.toBeNull();
    expect(evidenceModal?.getAttribute('role')).toBe('dialog');
    expect(evidenceModal?.getAttribute('aria-modal')).toBe('true');
    expect(evidenceModal?.getAttribute('aria-labelledby')).toBe('modal-title-scene-evidence');

    const titleEl = document.querySelector('#modal-title-scene-evidence');
    expect(titleEl?.textContent).toContain('Wissenschaftliche Einordnung');

    // Test accordion inside scene evidence modal
    const nodeAccordion = evidenceModal?.querySelector<HTMLElement>('.sources-accordion');
    expect(nodeAccordion).not.toBeNull();

    const nodeToggleBtn = nodeAccordion?.querySelector<HTMLButtonElement>('.sources-toggle-btn')!;
    const nodeBody = nodeAccordion?.querySelector<HTMLElement>('.sources-body')!;

    expect(nodeToggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(nodeBody.classList.contains('hidden')).toBe(true);

    nodeToggleBtn.click();
    expect(nodeToggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(nodeBody.classList.contains('hidden')).toBe(false);

    sceneView.destroy();
  });

  it('should render and toggle Teaser Evidence Accordion via public renderTeaserCardHtml', () => {
    const actionModal = new ActionModal();
    const cbtTeaserLoc = WORLD_DATA.locations.find(l => l.id === 'loc_teaser_cbt')!;

    const container = document.createElement('div');
    container.className = 'location-preview-card';
    container.innerHTML = renderTeaserCardHtml(cbtTeaserLoc, actionModal);
    document.body.appendChild(container);

    actionModal.attachAccordionListeners(container);

    const teaserAccordion = container.querySelector<HTMLElement>('.sources-accordion');
    expect(teaserAccordion).not.toBeNull();

    const teaserBtn = teaserAccordion?.querySelector<HTMLButtonElement>('.sources-toggle-btn')!;
    const teaserBody = teaserAccordion?.querySelector<HTMLElement>('.sources-body')!;

    expect(teaserBtn.getAttribute('aria-expanded')).toBe('false');
    expect(teaserBody.classList.contains('hidden')).toBe(true);

    // Expand
    teaserBtn.click();
    expect(teaserBtn.getAttribute('aria-expanded')).toBe('true');
    expect(teaserBody.classList.contains('hidden')).toBe(false);

    // Check that knowledge node claim is present
    expect(teaserBody.textContent).toContain('G-BA');

    // Collapse
    teaserBtn.click();
    expect(teaserBtn.getAttribute('aria-expanded')).toBe('false');
    expect(teaserBody.classList.contains('hidden')).toBe(true);
  });
});
