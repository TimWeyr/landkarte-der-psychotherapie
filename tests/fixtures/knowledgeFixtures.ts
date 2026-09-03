import { KnowledgeDatasets, getDefaultDatasets } from '../../src/validation/validateKnowledge';
import { SourceRecord, ClaimRecord, KnowledgeNode, KnowledgeRelation, ExplorationRoute, WorldMapData, Scene } from '../../src/types';

export function createTestKnowledgeFixture(overrides?: {
  sources?: SourceRecord[];
  claims?: ClaimRecord[];
  nodes?: KnowledgeNode[];
  relations?: KnowledgeRelation[];
  routes?: ExplorationRoute[];
  worldData?: WorldMapData;
  scenesRegistry?: Record<string, Scene>;
}): KnowledgeDatasets {
  const defaults = getDefaultDatasets();
  const cloned: KnowledgeDatasets = JSON.parse(JSON.stringify(defaults));

  return {
    sources: overrides?.sources ?? cloned.sources,
    claims: overrides?.claims ?? cloned.claims,
    nodes: overrides?.nodes ?? cloned.nodes,
    relations: overrides?.relations ?? cloned.relations,
    routes: overrides?.routes ?? cloned.routes,
    worldData: overrides?.worldData ?? cloned.worldData,
    scenesRegistry: overrides?.scenesRegistry ?? { ...defaults.scenesRegistry }
  };
}
