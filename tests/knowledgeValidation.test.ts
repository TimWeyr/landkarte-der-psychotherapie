import { describe, it, expect, beforeEach } from 'vitest';
import { validateKnowledgeGraph, getReachableClaimIds, getDefaultDatasets } from '../src/validation/validateKnowledge';
import { createTestKnowledgeFixture } from './fixtures/knowledgeFixtures';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';
import { computeRouteNavigationEffect } from '../src/main';

describe('Knowledge Graph Two-Phase Integrity, Negative DI, Reachability & Routing Tests', () => {
  beforeEach(() => {
    localStorage.clear();
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

  it('should accept forward references when RouteOption or Condition points to an entity in a later scene', () => {
    const fixture = createTestKnowledgeFixture();

    // Scene 1 (first registered) has a condition pointing to an item in Scene 2 (later registered)
    fixture.scenesRegistry['scene_lighthouse'].hotspots[0].conditions = [
      {
        type: 'ITEM_COLLECTED',
        targetId: 'item_notepad_action' // located in scene_workshop!
      },
      {
        type: 'VISITED',
        targetId: 'loc_workshop'
      }
    ];

    // RouteOption in route points to bookmark in scene_workshop
    fixture.routes[0].options[0].bookmarkId = 'bm_initial_interview_question_action';

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(true);
    expect(report.errorsCount).toBe(0);
  });

  it('should reject route with only need (missing working-mode)', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].options[0].targetKnowledgeNodeIds = ['node_need_structure_coping']; // only need!

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(report.issues.some(i => i.message.includes('mindestens einen \'need\'- und mindestens einen \'working-mode\'-Knoten'))).toBe(true);
  });

  it('should reject route with only working-mode (missing need)', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].options[0].targetKnowledgeNodeIds = ['node_wm_concrete_action']; // only working-mode!

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(report.issues.some(i => i.message.includes('mindestens einen \'need\'- und mindestens einen \'working-mode\'-Knoten'))).toBe(true);
  });

  it('should reject unknown Perspective-, Disclaimer-, Teaser-, Dialog-, Quiz-, and Item-Claims', () => {
    // 1. Unknown disclaimer claim
    const fixDisclaimer = createTestKnowledgeFixture();
    fixDisclaimer.routes[0].disclaimerClaimIds = ['claim_non_existent_disclaimer'];
    const repDisc = validateKnowledgeGraph(fixDisclaimer);
    expect(repDisc.isValid).toBe(false);
    expect(repDisc.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 2. Unknown perspective claim
    const fixPersp = createTestKnowledgeFixture();
    fixPersp.routes[0].options[0].perspectiveClaimIds = ['claim_non_existent_persp'];
    const repPersp = validateKnowledgeGraph(fixPersp);
    expect(repPersp.isValid).toBe(false);
    expect(repPersp.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 3. Unknown teaser claim
    const fixTeaser = createTestKnowledgeFixture();
    fixTeaser.worldData.locations[3].teaserClaimIds = ['claim_non_existent_teaser'];
    const repTeaser = validateKnowledgeGraph(fixTeaser);
    expect(repTeaser.isValid).toBe(false);
    expect(repTeaser.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 4. Unknown dialogue claim
    const fixDial = createTestKnowledgeFixture();
    fixDial.scenesRegistry['scene_lighthouse'].hotspots[0].dialogue.claimIds = ['claim_non_existent_dial'];
    const repDial = validateKnowledgeGraph(fixDial);
    expect(repDial.isValid).toBe(false);
    expect(repDial.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

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
    const repQuiz = validateKnowledgeGraph(fixQuiz);
    expect(repQuiz.isValid).toBe(false);
    expect(repQuiz.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

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
    const repItem = validateKnowledgeGraph(fixItem);
    expect(repItem.isValid).toBe(false);
    expect(repItem.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
  });

  it('should reject NAVIGATE_ROUTES action with non-existent routeId', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.scenesRegistry['scene_lighthouse'].hotspots[0].dialogue.actions = [
      {
        id: 'act_broken_nav',
        type: 'NAVIGATE_ROUTES',
        label: 'Broken Nav',
        routeId: 'route_non_existent_xyz'
      }
    ];

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(report.issues.some(i => i.message.includes('Action NAVIGATE_ROUTES verweist auf unbekannte routeId'))).toBe(true);
  });

  it('should reject RouteOption with bookmarkId pointing to non-existent or non-BOOKMARK action', () => {
    // 1. Pointing to non-existent action
    const fix1 = createTestKnowledgeFixture();
    fix1.routes[0].options[0].bookmarkId = 'bm_non_existent_action';
    const rep1 = validateKnowledgeGraph(fix1);
    expect(rep1.isValid).toBe(false);
    expect(rep1.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 2. Pointing to an action that is not a BOOKMARK (e.g. ITEM)
    const fix2 = createTestKnowledgeFixture();
    fix2.routes[0].options[0].bookmarkId = 'act_lh_item_lens'; // This is an ITEM action
    const rep2 = validateKnowledgeGraph(fix2);
    expect(rep2.isValid).toBe(false);
    expect(rep2.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
  });

  it('should reject duplicate region IDs and Location pointing to unknown regionId', () => {
    // 1. Duplicate region ID
    const fixDupReg = createTestKnowledgeFixture();
    fixDupReg.worldData.regions.push({ ...fixDupReg.worldData.regions[0] });
    const rep1 = validateKnowledgeGraph(fixDupReg);
    expect(rep1.isValid).toBe(false);
    expect(rep1.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 2. Unknown regionId
    const fixUnknownReg = createTestKnowledgeFixture();
    fixUnknownReg.worldData.locations[0].regionId = 'reg_non_existent';
    const rep2 = validateKnowledgeGraph(fixUnknownReg);
    expect(rep2.isValid).toBe(false);
    expect(rep2.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
  });

  it('should reject duplicate item IDs across actions', () => {
    const fixture = createTestKnowledgeFixture();
    // Add another item action with the same itemId 'item_lens_differentiation'
    fixture.scenesRegistry['scene_station'].hotspots[0].dialogue.actions = [
      {
        id: 'act_duplicate_item',
        type: 'ITEM',
        label: 'Duplicate Item',
        item: {
          itemId: 'item_lens_differentiation', // duplicate!
          title: 'Duplicate Item',
          description: 'Duplicate Desc',
          icon: 'eye'
        }
      }
    ];

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(report.issues.some(i => i.message.includes('Doppelte Item-ID gefunden: item_lens_differentiation'))).toBe(true);
  });

  it('should validate Condition.targetId by condition type', () => {
    // 1. VISITED with non-existent location
    const fixVisited = createTestKnowledgeFixture();
    fixVisited.scenesRegistry['scene_lighthouse'].hotspots[0].conditions = [
      { type: 'VISITED', targetId: 'loc_non_existent' }
    ];
    const repVisited = validateKnowledgeGraph(fixVisited);
    expect(repVisited.isValid).toBe(false);
    expect(repVisited.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 2. ITEM_COLLECTED with non-existent itemId
    const fixItem = createTestKnowledgeFixture();
    fixItem.scenesRegistry['scene_lighthouse'].hotspots[0].conditions = [
      { type: 'ITEM_COLLECTED', targetId: 'item_non_existent' }
    ];
    const repItem = validateKnowledgeGraph(fixItem);
    expect(repItem.isValid).toBe(false);
    expect(repItem.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');

    // 3. QUIZ_SOLVED with non-existent quizActionId
    const fixQuiz = createTestKnowledgeFixture();
    fixQuiz.scenesRegistry['scene_lighthouse'].hotspots[0].conditions = [
      { type: 'QUIZ_SOLVED', targetId: 'act_non_existent_quiz' }
    ];
    const repQuiz = validateKnowledgeGraph(fixQuiz);
    expect(repQuiz.isValid).toBe(false);
    expect(repQuiz.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
  });

  it('should reject unknown Location-KnowledgeNode-ID', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.worldData.locations[0].knowledgeNodeIds = ['node_non_existent_loc_node'];

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(report.issues.some(i => i.message.includes('Location knowledgeNodeIds verweist auf unbekannte Node-ID'))).toBe(true);
  });

  it('should reject duplicate Relation-, Route-, Location-, Scene-, and Hotspot-IDs', () => {
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
    expect(rep1.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
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
    expect(rep2.releaseStatus).toBe('BLOCKED_BY_VALIDATION_ERRORS');
    expect(rep2.issues.some(i => i.message.includes('referenziert keine registrierte Szene'))).toBe(true);
  });

  it('should block release when a draft claim is reachable behind multiple relation hops (BFS traversal)', () => {
    const fixture = createTestKnowledgeFixture();

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

  it('should generically exclude originLocationId during Route Option 1 navigation and not mutate state', () => {
    const route = getDefaultDatasets().routes[0];
    const locations = getDefaultDatasets().worldData.locations;
    const opt1 = route.options[0];

    const stateBefore = JSON.stringify(store.getState());

    // 1. With originLocationId = 'loc_lighthouse' -> must return strictly ['loc_workshop']
    const result1 = computeRouteNavigationEffect(opt1, locations, 'loc_lighthouse');
    expect(result1.highlightedLocationIds).toEqual(['loc_workshop']);
    expect(result1.isNeutralPerspective).toBe(false);

    // 2. With originLocationId = 'loc_workshop' -> excludes workshop and returns []
    const result2 = computeRouteNavigationEffect(opt1, locations, 'loc_workshop');
    expect(result2.highlightedLocationIds).toEqual([]);

    // 3. State must be completely unmodified
    const stateAfter = JSON.stringify(store.getState());
    expect(stateAfter).toBe(stateBefore);
  });

  it('should ensure Options 2-5 produce neutral development banner, no highlight and zero state mutation in the routing controller', () => {
    const route = getDefaultDatasets().routes[0];
    const locations = getDefaultDatasets().worldData.locations;

    for (let i = 1; i < 5; i++) {
      const option = route.options[i];
      const stateBefore = JSON.stringify(store.getState());

      const result = computeRouteNavigationEffect(option, locations, 'loc_lighthouse');

      // Result must have NO highlighted locations
      expect(result.highlightedLocationIds).toEqual([]);
      expect(result.isNeutralPerspective).toBe(true);
      expect(result.bannerHtml).toContain('Diese Erkundungsperspektive ist vorgemerkt');

      // State must be completely unmodified
      const stateAfter = JSON.stringify(store.getState());
      expect(stateAfter).toBe(stateBefore);
    }
  });
});
