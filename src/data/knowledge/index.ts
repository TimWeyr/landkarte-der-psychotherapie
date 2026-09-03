import { SourceRecord, ClaimRecord, KnowledgeNode, KnowledgeRelation, ClaimCitation } from '../../types';
import { SOURCES } from './sources';
import { CLAIMS } from './claims';
import { KNOWLEDGE_NODES } from './nodes';
import { KNOWLEDGE_RELATIONS } from './relations';

export * from './sources';
export * from './claims';
export * from './nodes';
export * from './relations';

export function getSourceById(id: string): SourceRecord | undefined {
  return SOURCES.find(s => s.id === id);
}

export function getClaimById(id: string): ClaimRecord | undefined {
  return CLAIMS.find(c => c.id === id);
}

export function getNodeById(id: string): KnowledgeNode | undefined {
  return KNOWLEDGE_NODES.find(n => n.id === id);
}

export function getRelationsForNode(nodeId: string): KnowledgeRelation[] {
  return KNOWLEDGE_RELATIONS.filter(r => r.fromNodeId === nodeId || r.toNodeId === nodeId);
}

export function getSourcesForClaim(claim: ClaimRecord): { citation: ClaimCitation; source: SourceRecord }[] {
  const result: { citation: ClaimCitation; source: SourceRecord }[] = [];
  for (const cit of claim.citations) {
    const src = getSourceById(cit.sourceId);
    if (src) {
      result.push({
        citation: cit,
        source: src
      });
    }
  }
  return result;
}
