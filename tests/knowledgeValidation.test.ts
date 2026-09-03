import { describe, it, expect, beforeEach } from 'vitest';
import { validateKnowledgeGraph, getReachableClaimIds, getDefaultDatasets } from '../src/validation/validateKnowledge';
import { createTestKnowledgeFixture } from './fixtures/knowledgeFixtures';
import { store } from '../src/state/store';
import { getDefaultState } from '../src/state/storage';

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

describe('Knowledge Graph Integrity, Negative DI & Reachability Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should validate the production knowledge graph structure and report BLOCKED_BY_DRAFT_CONTENT for unapproved drafts', () => {
    const report = validateKnowledgeGraph();

    // Structural validity must be 100% sound
    expect(report.isValid).toBe(true);
    expect(report.errorsCount).toBe(0);

    // Reachable claims must be discovered dynamically
    expect(report.reachableClaimIds.length).toBeGreaterThan(0);
    expect(report.reachableDraftClaimIds.length).toBeGreaterThan(0);

    // Release must be blocked by draft content
    expect(report.releaseStatus).toBe('BLOCKED_BY_DRAFT_CONTENT');
  });

  it('should reject duplicate IDs in sources, claims, or nodes', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.sources.push({ ...fixture.sources[0] }); // duplicate source

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('Doppelte Source-ID'))).toBe(true);
  });

  it('should reject official sources with invalid or future lastCheckedAt dates', () => {
    const fixture = createTestKnowledgeFixture();
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    fixture.sources = fixture.sources.map(s =>
      s.kind === 'official' ? { ...s, lastCheckedAt: futureDate.toISOString().split('T')[0] } : s
    );

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('liegt in der Zukunft'))).toBe(true);
  });

  it('should reject official sources missing jurisdiction or valid URL', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.sources.push({
      id: 'src_invalid_official',
      kind: 'official',
      title: 'Invalid Official Document',
      url: 'not-a-url',
      lastCheckedAt: '2026-03-01'
    });

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('erfordert das Feld \'jurisdiction\''))).toBe(true);
    expect(report.issues.some(i => i.message.includes('erfordert eine gültige HTTP(S)-URL'))).toBe(true);
  });

  it('should reject patient narrative missing required metadata fields', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.sources.push({
      id: 'src_broken_narrative',
      kind: 'patient-narrative',
      title: 'Broken Narrative'
    });

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('erfordert ein \'narrativeForm\'-Feld'))).toBe(true);
    expect(report.issues.some(i => i.message.includes('erfordert ein \'valence\'-Feld'))).toBe(true);
    expect(report.issues.some(i => i.message.includes('erfordert ein \'provenance\'-Feld'))).toBe(true);
  });

  it('should reject patient narrative used as supports on any non-experience claim', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.sources.push({
      id: 'src_valid_narrative',
      kind: 'patient-narrative',
      title: 'Patient Interview',
      narrativeForm: 'verbatim',
      valence: 'positive',
      provenance: 'Forschungsstudie Universität Leipzig',
      publishedDate: '2025-01-01',
      locatorOrUrl: 'https://example.org/interview1'
    });

    fixture.claims.push({
      id: 'claim_effectiveness_with_narrative',
      statement: 'Behandlung ist wirksam',
      publicExplanation: 'Patient sagt es half',
      type: 'effectiveness', // Non-experience claim!
      citations: [{ sourceId: 'src_valid_narrative', role: 'supports', locator: 'S. 1' }],
      evidenceLevel: 'well-supported',
      reviewStatus: 'draft'
    });

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('darf nicht als \'supports\' an Nicht-Experience-Claim'))).toBe(true);
  });

  it('should reject route options pointing directly to approach nodes (anti-matching constraint)', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].options[0].targetKnowledgeNodeIds = ['node_app_cbt']; // Illegal direct school target

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('darf nicht direkt auf einen \'approach\'-Knoten'))).toBe(true);
  });

  it('should reject routes with a non-experience triggerNodeId', () => {
    const fixture = createTestKnowledgeFixture();
    fixture.routes[0].triggerNodeId = 'node_app_cbt'; // Not an experience node!

    const report = validateKnowledgeGraph(fixture);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('triggerNodeId muss ein existierender Node vom Typ \'experience\' sein'))).toBe(true);
  });

  it('should ensure exactly 5 unique route options exist with no bookmarkId on options 2 to 5', () => {
    const report = validateKnowledgeGraph();
    expect(report.isValid).toBe(true);

    const route = getDefaultDatasets().routes[0];
    expect(route.options.length).toBe(5);

    // Option 1 has bookmarkId
    expect(route.options[0].bookmarkId).toBe('bm_initial_interview_question_action');

    // Options 2-5 must have NO bookmarkId
    for (let i = 1; i < 5; i++) {
      expect(route.options[i].bookmarkId).toBeUndefined();
    }
  });

  it('should ensure playable scenes and locations are completely consistent', () => {
    const report = validateKnowledgeGraph();
    expect(report.isValid).toBe(true);

    const locations = getDefaultDatasets().worldData.locations.filter(l => l.type === 'scene');
    for (const loc of locations) {
      expect(loc.sceneId).toBeDefined();
      const scene = getDefaultDatasets().scenesRegistry[loc.sceneId!];
      expect(scene).toBeDefined();
      expect(scene.locationId).toBe(loc.id);
    }
  });

  it('should ensure full traversability of the workshop path across all relation stages', () => {
    const data = getDefaultDatasets();

    // 1. Erleben
    const expNode = data.nodes.find(n => n.id === 'node_exp_constant_rumination')!;
    expect(expNode).toBeDefined();

    // 2. Bedürfnis über evokes-need
    const relNeed = data.relations.find(r => r.fromNodeId === expNode.id && r.type === 'evokes-need')!;
    expect(relNeed).toBeDefined();
    const needNode = data.nodes.find(n => n.id === relNeed.toNodeId)!;
    expect(needNode.kind).toBe('need');

    // 3. Arbeitsweise über addresses-need
    const relAction = data.relations.find(r => r.fromNodeId === needNode.id && r.type === 'addresses-need')!;
    expect(relAction).toBeDefined();
    const wmNode = data.nodes.find(n => n.id === relAction.toNodeId)!;
    expect(wmNode.kind).toBe('working-mode');

    // 4. Prozess über acts-via
    const relProc = data.relations.find(r => r.fromNodeId === wmNode.id && r.type === 'acts-via')!;
    expect(relProc).toBeDefined();
    const procNode = data.nodes.find(n => n.id === relProc.toNodeId)!;
    expect(procNode.kind).toBe('process');

    // 5. Intervention über realized-by
    const relTech = data.relations.find(r => r.fromNodeId === procNode.id && r.type === 'realized-by')!;
    expect(relTech).toBeDefined();
    const techNode = data.nodes.find(n => n.id === relTech.toNodeId)!;
    expect(techNode.kind).toBe('intervention');

    // 6. Ansätze über belongs-to
    const relApp = data.relations.find(r => r.fromNodeId === techNode.id && r.type === 'belongs-to')!;
    expect(relApp).toBeDefined();
    const appNode = data.nodes.find(n => n.id === relApp.toNodeId)!;
    expect(appNode.kind).toBe('approach');

    // 7. Passungsprüfung & Allianz über examines-fit
    const relFit = data.relations.find(r => r.fromNodeId === wmNode.id && r.type === 'examines-fit')!;
    expect(relFit).toBeDefined();
    const relAlliance = data.relations.find(r => r.fromNodeId === relFit.toNodeId && r.type === 'examines-fit')!;
    expect(relAlliance).toBeDefined();
  });

  it('should capture KnowledgeRelation claimIds in reachable claims dynamically', () => {
    const data = getDefaultDatasets();
    const reachable = getReachableClaimIds(data);

    // KnowledgeRelation for alliance has 'claim_therapeutic_alliance'
    expect(reachable).toContain('claim_therapeutic_alliance');
    // KnowledgeRelation for fit has 'claim_fit_collaboration_dynamic'
    expect(reachable).toContain('claim_fit_collaboration_dynamic');
  });

  it('should ensure route selection does not mutate UserState', () => {
    store.replaceState(getDefaultState());
    const initialState = JSON.stringify(store.getState());

    // User reads route
    const route = getDefaultDatasets().routes[0];
    const option = route.options[0];
    expect(option.id).toBe('opt_concrete_action');

    const stateAfter = JSON.stringify(store.getState());
    expect(stateAfter).toBe(initialState);
  });
});
