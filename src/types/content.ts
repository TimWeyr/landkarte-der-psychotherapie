export type KnowledgeNodeKind =
  | 'experience'
  | 'need'
  | 'working-mode'
  | 'process'
  | 'intervention'
  | 'approach'
  | 'care-structure'
  | 'collaboration';

export type SourceKind =
  | 'systematic-review'
  | 'primary-study'
  | 'official'
  | 'theory'
  | 'patient-narrative'
  | 'position-paper';

export type NarrativeValence = 'positive' | 'negative' | 'mixed';

export type EvidenceLevel =
  | 'well-supported'
  | 'limited'
  | 'mixed'
  | 'not-established'
  | 'not-applicable';

export type ReviewStatus = 'draft' | 'source-checked' | 'approved';

export type ClaimType =
  | 'effectiveness'
  | 'association'
  | 'process'
  | 'definition'
  | 'care-fact'
  | 'theory'
  | 'experience';

export type CitationRole = 'supports' | 'qualifies' | 'contradicts' | 'background';

export type NarrativeForm = 'verbatim' | 'paraphrase' | 'composite' | 'qualitative-finding';

export interface ClaimCitation {
  sourceId: string;
  role: CitationRole;
  locator?: string;
  note?: string;
}

export interface SourceRecord {
  id: string;
  kind: SourceKind;
  title: string;
  authors?: string;
  year?: number;
  venue?: string;
  url?: string;
  doi?: string;
  jurisdiction?: 'DE' | 'EU' | 'INT';
  validFrom?: string;
  validTo?: string;
  lastCheckedAt?: string;
  peerReviewed?: boolean;
  narrativeForm?: NarrativeForm;
  valence?: NarrativeValence;
  provenance?: string;
  publishedDate?: string;
  locatorOrUrl?: string;
}

export interface ClaimRecord {
  id: string;
  statement: string;
  publicExplanation: string;
  type: ClaimType;
  citations: ClaimCitation[];
  evidenceLevel: EvidenceLevel;
  reviewStatus: ReviewStatus;
  limitations?: string;
}

export interface KnowledgeNode {
  id: string;
  kind: KnowledgeNodeKind;
  title: string;
  plainDescription: string;
  claimIds: string[];
  tags: string[];
}

/**
 * Richtungssemantik der Wissensrelationen (fromNodeId -> toNodeId):
 * - `acts-via`: [working-mode] -> [process] (Eine Arbeitsweise wirkt über einen psychologischen Veränderungsprozess)
 * - `realized-by`: [process] -> [intervention] (Ein Veränderungsprozess wird durch eine konkrete Intervention/Technik realisiert)
 * - `implements`: [intervention] -> [process] (Eine Intervention implementiert einen Veränderungsprozess)
 * - `belongs-to`: [intervention] -> [approach] (Eine Methode wird in einem oder mehreren Therapieansätzen methodisch verortet)
 * - `examines-fit`: [working-mode | collaboration] -> [collaboration] (Übergang zur realen Passungsprüfung und Allianz)
 * - `explores-aspect`: [any] -> [any] (Erkundung weiterer inhaltlicher Facetten)
 */
export type RelationType =
  | 'implements'
  | 'realized-by'
  | 'acts-via'
  | 'belongs-to'
  | 'examines-fit'
  | 'explores-aspect';

export interface KnowledgeRelation {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: RelationType;
  claimIds: string[];
}

export interface RouteOption {
  id: string;
  label: string;
  perspectiveDescription: string;
  perspectiveClaimIds?: string[];
  targetKnowledgeNodeIds: string[];
  bookmarkId?: string;
}

export interface ExplorationRoute {
  id: string;
  prompt: string;
  triggerNodeId: string;
  disclaimer: string;
  disclaimerClaimIds?: string[];
  options: RouteOption[];
}
