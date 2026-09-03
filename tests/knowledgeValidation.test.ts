import { describe, it, expect, beforeEach } from 'vitest';
import { validateKnowledgeGraph, getReachableClaimIds, getDefaultDatasets } from '../src/validation/validateKnowledge';
import { createTestKnowledgeFixture } from './fixtures/knowledgeFixtures';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';
import { computeRouteNavigationEffect } from '../src/main';
import { ActionModal } from '../src/ui/ActionModal';

// Mock localStorage for Node environment in tests
const localStorageMock = (() => {
  let storageStore: Record<string, string> = {};
  return {
    getItem: (key: string) => storageStore[key] || null,
    setItem: (key: string, value: string) => {
      storageStore[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete storageStore[key];
    },
    clear: () => {
      storageStore = {};
    }
  };
})();

(globalThis as any).localStorage = localStorageMock;

describe('Knowledge Graph Integrity, Negative DI, Reachability & UI Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    store.replaceState(getDefaultState());
  });

  it('should validate the production knowledge graph structure and report BLOCKED_BY_DRAFT_CONTENT for unapproved drafts', () => {
    const report = validateKnowledgeGraph();

    expect(report.isValid).toBe(true);
    expect(report.errorsCount).toBe(0);
    expect(report.reachableClaimIds.length).toBeGreaterThan(0);
    expect(report.reachableDraftClaimIds.length).toBeGreaterThan(0);
    expect(report.releaseStatus).toBe('BLOCKED_BY_DRAFT_CONTENT');
  });

  it('should reject route with only need (missing working-mode)', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].options[0].targetKnowledgeNodeIds = ['node_need_structure_coping']; // only need!

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('mindestens einen \'need\'- und mindestens einen \'working-mode\'-Knoten'))).toBe(true);
  });

  it('should reject route with only working-mode (missing need)', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].options[0].targetKnowledgeNodeIds = ['node_wm_concrete_action']; // only working-mode!

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('mindestens einen \'need\'- und mindestens einen \'working-mode\'-Knoten'))).toBe(true);
  });

  it('should reject unknown Perspective-, Disclaimer-, Teaser-, Dialog-, Quiz-, and Item-Claims', () => {
    // 1. Unknown disclaimer claim
    const fixDisclaimer = createTestKnowledgeFixture();
    fixDisclaimer.routes[0].disclaimerClaimIds = ['claim_non_existent_disclaimer'];
    expect(validateKnowledgeGraph(fixDisclaimer).isValid).toBe(false);

    // 2. Unknown perspective claim
    const fixPersp = createTestKnowledgeFixture();
    fixPersp.routes[0].options[0].perspectiveClaimIds = ['claim_non_existent_persp'];
    expect(validateKnowledgeGraph(fixPersp).isValid).toBe(false);

    // 3. Unknown teaser claim
    const fixTeaser = createTestKnowledgeFixture();
    fixTeaser.worldData.locations[3].teaserClaimIds = ['claim_non_existent_teaser'];
    expect(validateKnowledgeGraph(fixTeaser).isValid).toBe(false);

    // 4. Unknown dialogue claim
    const fixDial = createTestKnowledgeFixture();
    fixDial.scenesRegistry['scene_lighthouse'].hotspots[0].dialogue.claimIds = ['claim_non_existent_dial'];
    expect(validateKnowledgeGraph(fixDial).isValid).toBe(false);

    // 5. Unknown quiz claim
    const fixQuiz = createTestKnowledgeFixture();
    fixQuiz.scenesRegistry['scene_lighthouse'].hotspots[0].dialogue.actions = [
      {
        id: 'act_quiz_unknown',
        type: 'QUIZ',
        label: 'Test Quiz',
        quiz: {
          question: 'Frage',
          options: ['A', 'B'],
          correctIndex: 0,
          explanation: 'Erklärung',
          explanationClaimIds: ['claim_non_existent_quiz']
        }
      }
    ];
    expect(validateKnowledgeGraph(fixQuiz).isValid).toBe(false);

    // 6. Unknown item claim
    const fixItem = createTestKnowledgeFixture();
    fixItem.scenesRegistry['scene_lighthouse'].hotspots[0].dialogue.actions = [
      {
        id: 'act_item_unknown',
        type: 'ITEM',
        label: 'Test Item',
        item: {
          itemId: 'item_test',
          title: 'Item',
          description: 'Desc',
          icon: 'box',
          claimIds: ['claim_non_existent_item']
        }
      }
    ];
    expect(validateKnowledgeGraph(fixItem).isValid).toBe(false);
  });

  it('should reject unknown Location-KnowledgeNode-ID', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.worldData.locations[0].knowledgeNodeIds = ['node_non_existent_loc_node'];

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('Location knowledgeNodeIds verweist auf unbekannte Node-ID'))).toBe(true);
  });

  it('should reject duplicate Relation-, Route-, Location-, Scene-, Hotspot-, and Action-IDs', () => {
    // Duplicate Relation ID
    const fixRel = createTestKnowledgeFixture();
    fixRel.relations.push({ ...fixRel.relations[0] });
    expect(validateKnowledgeGraph(fixRel).isValid).toBe(false);

    // Duplicate Route ID
    const fixRoute = createTestKnowledgeFixture();
    fixRoute.routes.push({ ...fixRoute.routes[0] });
    expect(validateKnowledgeGraph(fixRoute).isValid).toBe(false);

    // Duplicate Location ID
    const fixLoc = createTestKnowledgeFixture();
    fixLoc.worldData.locations.push({ ...fixLoc.worldData.locations[0] });
    expect(validateKnowledgeGraph(fixLoc).isValid).toBe(false);

    // Duplicate Hotspot ID
    const fixHotspot = createTestKnowledgeFixture();
    fixHotspot.scenesRegistry['scene_lighthouse'].hotspots.push({
      ...fixHotspot.scenesRegistry['scene_lighthouse'].hotspots[0]
    });
    expect(validateKnowledgeGraph(fixHotspot).isValid).toBe(false);
  });

  it('should reject orphaned scene and orphaned scene-location', () => {
    // 1. Orphaned scene (scene in registry points to non-existent location)
    const fixOrphanScene = createTestKnowledgeFixture();
    fixOrphanScene.scenesRegistry['scene_orphan'] = {
      id: 'scene_orphan',
      locationId: 'loc_non_existent_scene_loc',
      title: 'Verwaist',
      imageSrc: '/test.jpg',
      hotspots: []
    };
    const rep1 = validateKnowledgeGraph(fixOrphanScene);
    expect(rep1.isValid).toBe(false);
    expect(rep1.issues.some(i => i.message.includes('Verwaiste Szene'))).toBe(true);

    // 2. Orphaned scene-location (location points to non-existent scene)
    const fixOrphanLoc = createTestKnowledgeFixture();
    fixOrphanLoc.worldData.locations.push({
      id: 'loc_broken_scene',
      name: 'Kaputter Schauplatz',
      regionId: 'reg_central',
      type: 'scene',
      sceneId: 'scene_missing',
      xPercent: 50,
      yPercent: 50,
      icon: 'map',
      tagline: 'Test'
    });
    const rep2 = validateKnowledgeGraph(fixOrphanLoc);
    expect(rep2.isValid).toBe(false);
    expect(rep2.issues.some(i => i.message.includes('referenziert keine registrierte Szene'))).toBe(true);
  });

  it('should block release when a draft claim is reachable behind multiple relation hops (BFS traversal)', () => {
    const fixture = createTestKnowledgeFixture();

    // Add a multi-hop chain:
    // node_tech_behavioral_experiment -> (realized-by) -> node_deep_hop1 -> (acts-via) -> node_deep_hop2
    fixture.nodes.push({
      id: 'node_deep_hop1',
      kind: 'process',
      title: 'Hop 1 Process',
      plainDescription: 'Hop 1',
      claimIds: [],
      tags: []
    });
    fixture.nodes.push({
      id: 'node_deep_hop2',
      kind: 'process',
      title: 'Hop 2 Process',
      plainDescription: 'Hop 2',
      claimIds: ['claim_deep_draft_hop2'],
      tags: []
    });

    fixture.claims.push({
      id: 'claim_deep_draft_hop2',
      statement: 'Deep Draft Statement',
      publicExplanation: 'Deep Draft Explanation',
      type: 'process',
      citations: [],
      evidenceLevel: 'not-applicable',
      reviewStatus: 'draft'
    });

    fixture.relations.push({
      id: 'rel_hop1',
      fromNodeId: 'node_tech_behavioral_experiment',
      toNodeId: 'node_deep_hop1',
      type: 'acts-via',
      claimIds: []
    });
    fixture.relations.push({
      id: 'rel_hop2',
      fromNodeId: 'node_deep_hop1',
      toNodeId: 'node_deep_hop2',
      type: 'acts-via',
      claimIds: []
    });

    const reachable = getReachableClaimIds(fixture);
    expect(reachable).toContain('claim_deep_draft_hop2');

    const report = validateKnowledgeGraph(fixture);
    expect(report.reachableDraftClaimIds).toContain('claim_deep_draft_hop2');
    expect(report.releaseStatus).toBe('BLOCKED_BY_DRAFT_CONTENT');
  });

  it('should ensure full route-based workshop chain without experience -> evokes-need relation', () => {
    const data = getDefaultDatasets();

    // Ensure no automatic experience -> need relation exists
    const illegalRel = data.relations.find(r => r.fromNodeId === 'node_exp_constant_rumination');
    expect(illegalRel).toBeUndefined();

    // 1. Didaktische Route verknüpft Erleben mit RouteOption
    const route = data.routes[0];
    expect(route.triggerNodeId).toBe('node_exp_constant_rumination');

    const opt1 = route.options[0];
    expect(opt1.targetKnowledgeNodeIds).toContain('node_need_structure_coping');
    expect(opt1.targetKnowledgeNodeIds).toContain('node_wm_concrete_action');

    // 2. Arbeitsweise -> Prozess (acts-via)
    const relProc = data.relations.find(r => r.fromNodeId === 'node_wm_concrete_action' && r.type === 'acts-via')!;
    expect(relProc).toBeDefined();
    expect(relProc.toNodeId).toBe('node_proc_behavioral_activation');

    // 3. Prozess -> Intervention (realized-by)
    const relTech = data.relations.find(r => r.fromNodeId === relProc.toNodeId && r.type === 'realized-by')!;
    expect(relTech).toBeDefined();
    expect(relTech.toNodeId).toBe('node_tech_behavioral_experiment');

    // 4. Intervention -> Ansatz (belongs-to)
    const relApp = data.relations.find(r => r.fromNodeId === relTech.toNodeId && r.type === 'belongs-to')!;
    expect(relApp).toBeDefined();
    expect(relApp.toNodeId).toBe('node_app_cbt');

    // 5. Passungsprüfung & Allianz (examines-fit)
    const relFit = data.relations.find(r => r.fromNodeId === 'node_wm_concrete_action' && r.type === 'examines-fit')!;
    expect(relFit).toBeDefined();
    const relAlliance = data.relations.find(r => r.fromNodeId === relFit.toNodeId && r.type === 'examines-fit')!;
    expect(relAlliance).toBeDefined();
    expect(relAlliance.toNodeId).toBe('node_collab_therapeutic_alliance');
  });

  it('should ensure Options 2-5 produce neutral development banner, no highlight and zero state mutation in the routing controller', () => {
    const route = getDefaultDatasets().routes[0];
    const locations = getDefaultDatasets().worldData.locations;

    for (let i = 1; i < 5; i++) {
      const option = route.options[i];
      const stateBefore = JSON.stringify(store.getState());

      const result = computeRouteNavigationEffect(option, locations);

      // Result must have NO highlighted locations
      expect(result.highlightedLocationIds).toEqual([]);
      expect(result.isNeutralPerspective).toBe(true);
      expect(result.bannerHtml).toContain('Diese Erkundungsperspektive ist vorgemerkt');

      // State must be completely unmodified
      const stateAfter = JSON.stringify(store.getState());
      expect(stateAfter).toBe(stateBefore);
    }
  });

  it('should ensure Option 1 highlights workshop and does not mutate state', () => {
    const route = getDefaultDatasets().routes[0];
    const locations = getDefaultDatasets().worldData.locations;

    const opt1 = route.options[0];
    const stateBefore = JSON.stringify(store.getState());

    const result = computeRouteNavigationEffect(opt1, locations);
    expect(result.highlightedLocationIds).toContain('loc_workshop');
    expect(result.isNeutralPerspective).toBe(false);

    const stateAfter = JSON.stringify(store.getState());
    expect(stateAfter).toBe(stateBefore);
  });

  it('should ensure functional teaser-, disclaimer- and perspective-accordions in ActionModal', () => {
    const modal = new ActionModal();

    // 1. Perspective claim accordion rendering & interaction
    const container = document.createElement('div');
    container.innerHTML = `
      ${modal.renderSourcesAccordion(['claim_therapeutic_alliance'], 'Test Perspektive', 'test-persp')}
      ${modal.renderSourcesAccordion(['claim_fit_collaboration_dynamic'], 'Test Disclaimer', 'test-disclaimer')}
    `;

    modal.attachAccordionListeners(container);

    const accordions = container.querySelectorAll('.sources-accordion');
    expect(accordions.length).toBe(2);

    const toggleBtn1 = accordions[0].querySelector('.sources-toggle-btn') as HTMLButtonElement;
    const body1 = accordions[0].querySelector('.sources-body') as HTMLElement;

    expect(body1.classList.contains('hidden')).toBe(true);

    // Click to expand
    toggleBtn1.click();
    expect(body1.classList.contains('hidden')).toBe(false);

    // Click to collapse
    toggleBtn1.click();
    expect(body1.classList.contains('hidden')).toBe(true);
  });
});
