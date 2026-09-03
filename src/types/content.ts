/**
 * Strikte Typdefinitionen für den Wissensgraphen, Quellen, Claims, Relationen und didaktische Pfade.
 */

export type KnowledgeNodeKind =
  | 'experience'    // Subjektives Erleben / Beschwerdemuster (z.B. "Ständiges Grübeln")
  | 'need'          // Subjektives Bedürfnis / Ziel (z.B. "Wunsch nach Orientierung")
  | 'working-mode'  // Gewünschte Arbeitsweise (z.B. "Handlungsorientiertes Ausprobieren")
  | 'process'       // Therapeutischer Prozess / Wirkprinzip (z.B. "Klärung", "Problemaktualisierung")
  | 'intervention'  // Spezifische Intervention / Technik (z.B. "Verhaltensexperiment", "Stuhlarbeit")
  | 'approach'      // Therapieansatz / Verfahren (z.B. "KVT", "Systemische Therapie", "Gestalt")
  | 'care-structure'// Versorgungs- & Organisationsstruktur (z.B. "116 117", "Kostenerstattung")
  | 'collaboration';// Passung & reale Zusammenarbeit (z.B. "Therapeutische Allianz", "Passungsprüfung")

export type SourceKind =
  | 'systematic-review'   // Metaanalyse / Cochrane / Systematischer Review
  | 'primary-study'       // Randomisierte kontrollierte Studie (RCT) / Klinische Studie
  | 'official'            // G-BA Richtlinie / Gesetz / Kammer / Behörde
  | 'theory'              // Lehrbuch / Fachbuch / Theoretische Grundlagenschrift
  | 'patient-narrative'   // Qualitativer Patientenbericht / Erfahrungsstimme (kein Wirksamkeitsnachweis!)
  | 'position-paper';     // Stellungnahme / Fachgesellschaft

export type EvidenceLevel =
  | 'well-supported'      // Durch mehrere methodisch hochwertige empirische Studien/Reviews belegt
  | 'limited'             // Erste empirische Hinweise / Vorläufige Evidenz
  | 'mixed'               // Widersprüchliche empirische Studienlage
  | 'not-established'     // Wissenschaftlich nicht nachgewiesen / Vorwiegend hypothetisch
  | 'not-applicable';     // Reines Strukturwissen / Gesetz / Erfahrungsbericht / Reines Konzept

export type ReviewStatus =
  | 'draft'               // Vorläufiger Entwurf, noch nicht mit Originalfundstelle abgeglichen
  | 'source-checked'      // Quelle und konkrete Zitatstelle überprüft
  | 'approved';           // Vollständig freigegeben

export type ClaimType =
  | 'effectiveness'       // Empirischer Wirksamkeitsnachweis
  | 'association'         // Empirischer statistischer Zusammenhang / Prädiktor (z.B. Allianz -> Outcome)
  | 'process'             // Wirkmechanismus / Therapeutischer Ablauf
  | 'definition'          // Begriffsklärung / Definition
  | 'care-fact'           // Rechtliche & organisatorische Versorgungsregel
  | 'theory'              // Theoretisches Modell / Konzept
  | 'experience';         // Subjektive Erfahrung / Patientenperspektive

export type CitationRole =
  | 'supports'            // Stützt den Claim direkt empirisch oder offiziell
  | 'qualifies'           // Schränkt den Claim ein (z.B. spezifische Subgruppen, Grenzen)
  | 'contradicts'         // Widersprechender Befund (wesentlich bei 'mixed' Evidenz)
  | 'background';         // Theoretischer oder historischer Hintergrund

export type NarrativeForm =
  | 'verbatim'             // Wörtliches, autorisiertes Einzelzitat
  | 'paraphrase'            // Fachlich paraphrasierter Erfahrungsbericht
  | 'composite'             // Verdichtete / typisierte Erfahrungsstimme
  | 'qualitative-finding';  // Systematisch erhobener qualitativer Forschungsbefund

export interface ClaimCitation {
  sourceId: string;
  role: CitationRole;
  locator?: string;        // z.B. "S. 142", "Kapitel 3.2", "Tabelle 4", "§ 11 Abs. 2"
  note?: string;           // Fachlicher Kontext der Fundstelle
}

export interface SourceRecord {
  id: string;
  kind: SourceKind;
  title: string;
  authors?: string;
  year?: number;
  venue?: string;          // Journal, Verlag, herausgebende Institution
  doi?: string;            // Reiner DOI-Identifier (z.B. "10.1037/...")
  url?: string;            // Offizielle Web-URL
  peerReviewed?: boolean;
  jurisdiction?: string;   // z.B. "DE", "GKV-Bereich", "International"
  lastCheckedAt?: string;  // ISO-Datum der redaktionellen Prüfung (z.B. "2026-03-01")
  validFrom?: string;      // Gültig ab (z.B. Datum einer Strukturreform)
  validUntil?: string;     // Befristung / Aufhebung
  narrativeForm?: NarrativeForm; // Nur bei kind === 'patient-narrative'
  platform?: string;       // Plattform bei Narrativen (z.B. "Qualitative Studie", "Patientenbefragung")
}

export interface ClaimRecord {
  id: string;
  type: ClaimType;
  statement: string;
  publicExplanation: string;
  citations: ClaimCitation[];
  evidenceLevel: EvidenceLevel;
  reviewStatus: ReviewStatus;
  scope?: string;          // Geltungsbereich (z.B. "Erwachsene im ambulanten GKV-System")
  limitations?: string;    // Wichtige methodische oder versorgungsbezogene Einschränkungen
}

export interface KnowledgeNode {
  id: string;
  kind: KnowledgeNodeKind;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  claimIds: string[];      // Kanonische Verknüpfung zu Claims
}

export type RelationType =
  | 'belongs-to'           // Hierarchische Zuordnung (z.B. Technik gehört zu Methode)
  | 'implements'           // Praktische Umsetzung (z.B. Methode setzt Prozess um)
  | 'acts-via'             // Wirkmechanismus (z.B. Intervention wirkt über Prozess)
  | 'explores-aspect'      // Erkundungsbezug (z.B. Arbeitsweise beleuchtet Erleben)
  | 'contrasts-with'       // Fachliche Gegenüberstellung / Abgrenzung
  | 'examines-fit';        // Prüfung der realen Zusammenarbeit / Passung

export interface KnowledgeRelation {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType;
  description: string;
  claimIds?: string[];     // Beleg für die fachliche Relation
}

// Didaktische Erkundungsebene (Exploration)

export interface RouteOption {
  id: string;
  label: string;                  // z.B. "Ich möchte konkrete Strategien und Handlungsmöglichkeiten ausprobieren"
  perspectiveDescription: string; // Redaktionelle Erläuterung der Arbeitsweise
  perspectiveClaimIds?: string[]; // Fachliche Belege zur Arbeitsweise
  targetKnowledgeNodeIds: string[]; // Verweist auf KnowledgeNodes (werden zur Laufzeit auf Locations aufgelöst)
  bookmarkId?: string;            // Eindeutige ID für eine freiwillig speicherbare Erstgesprächsfrage
}

export interface ExplorationRoute {
  id: string;
  triggerNodeId: string;          // z.B. "node_exp_constant_rumination"
  prompt: string;                 // "Welche Arbeitsweise spricht dich am ehesten an?"
  disclaimer: string;             // Neutraler Transparenzhinweis
  disclaimerClaimIds?: string[];
  options: RouteOption[];         // Stabile, nicht-randomisierte 5 Perspektiven
}
