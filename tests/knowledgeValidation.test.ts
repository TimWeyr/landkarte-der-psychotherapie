import { describe, it, expect } from 'vitest';
import { validateKnowledgeGraph } from '../src/validation/validateKnowledge';
import { getExplorationRouteById } from '../src/data/exploration';
import { WORLD_DATA } from '../src/data/worldData';

describe('Knowledge Graph & Ontologie Validation', () => {
  it('should validate complete knowledge graph without structural errors', () => {
    const report = validateKnowledgeGraph();
    if (!report.isValid) {
      console.error('Validation Errors:', report.errors);
    }
    expect(report.errors).toEqual([]);
    expect(report.isValid).toBe(true);
    expect(report.stats.sourcesCount).toBeGreaterThanOrEqual(5);
    expect(report.stats.claimsCount).toBeGreaterThanOrEqual(5);
    expect(report.stats.nodesCount).toBeGreaterThanOrEqual(10);
    expect(report.stats.routesCount).toBeGreaterThanOrEqual(1);
  });

  it('should correctly mark releaseStatus as BLOCKED_BY_DRAFT_CONTENT if draft claims are present', () => {
    const report = validateKnowledgeGraph();
    expect(report.stats.draftClaimsCount).toBeGreaterThan(0);
    expect(report.releaseStatus).toBe('BLOCKED_BY_DRAFT_CONTENT');
  });

  it('should ensure Route Option 1 leads to at least one knowledge node that maps to an existing world location', () => {
    const route = getExplorationRouteById('route_rumination_perspectives');
    expect(route).toBeDefined();
    const opt1 = route?.options[0];
    expect(opt1).toBeDefined();

    // Resolve target knowledge nodes to locations
    const matchingLocations = WORLD_DATA.locations.filter(loc =>
      loc.knowledgeNodeIds?.some(nId => opt1?.targetKnowledgeNodeIds.includes(nId))
    );

    expect(matchingLocations.length).toBeGreaterThanOrEqual(1);
  });
});
