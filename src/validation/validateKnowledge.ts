import {
  SourceRecord,
  ClaimRecord,
  KnowledgeNode,
  KnowledgeRelation,
  ExplorationRoute,
  WorldMapData,
  Scene
} from '../types';
import { SOURCES } from '../data/knowledge/sources';
import { CLAIMS } from '../data/knowledge/claims';
import { KNOWLEDGE_NODES } from '../data/knowledge/nodes';
import { KNOWLEDGE_RELATIONS } from '../data/knowledge/relations';
import { EXPLORATION_ROUTES } from '../data/exploration/routes';
import { WORLD_DATA } from '../data/worldData';
import { SCENES_REGISTRY } from '../data/scenes';

export interface ValidationIssue {
  level: 'ERROR' | 'WARNING';
  category: 'ONTOLOGY' | 'CITATION' | 'INTEGRITY' | 'RELEASE_GATE' | 'CONSISTENCY';
  entityId: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  releaseStatus: 'RELEASE_READY' | 'BLOCKED_BY_DRAFT_CONTENT' | 'BLOCKED_BY_VALIDATION_ERRORS';
  errorsCount: number;
  warningsCount: number;
  reachableClaimIds: string[];
  reachableDraftClaimIds: string[];
  issues: ValidationIssue[];
}

export interface KnowledgeDatasets {
  sources: SourceRecord[];
  claims: ClaimRecord[];
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
  routes: ExplorationRoute[];
  worldData: WorldMapData;
  scenesRegistry: Record<string, Scene>;
}

export function getDefaultDatasets(): KnowledgeDatasets {
  return {
    sources: SOURCES,
    claims: CLAIMS,
    nodes: KNOWLEDGE_NODES,
    relations: KNOWLEDGE_RELATIONS,
    routes: EXPLORATION_ROUTES,
    worldData: WORLD_DATA,
    scenesRegistry: SCENES_REGISTRY
  };
}

/**
 * Ermittelt alle von der Anwendung aus erreichbaren Claim-IDs über Szenen, Aktionen, Routen, Teaser und Relationen
 */
export function getReachableClaimIds(data: KnowledgeDatasets): string[] {
  const reachableClaimIds = new Set<string>();
  const reachableNodeIds = new Set<string>();

  // 1. Aus Szenen, Dialogen, Subtexten, Quiz-Erklärungen und Items
  for (const scene of Object.values(data.scenesRegistry)) {
    for (const hotspot of scene.hotspots) {
      if (hotspot.dialogue.claimIds) {
        hotspot.dialogue.claimIds.forEach(id => reachableClaimIds.add(id));
      }
      if (hotspot.dialogue.subtextClaimIds) {
        hotspot.dialogue.subtextClaimIds.forEach(id => reachableClaimIds.add(id));
      }
      if (hotspot.dialogue.actions) {
        for (const action of hotspot.dialogue.actions) {
          if (action.claimIds) {
            action.claimIds.forEach(id => reachableClaimIds.add(id));
          }
          if (action.type === 'QUIZ' && action.quiz.explanationClaimIds) {
            action.quiz.explanationClaimIds.forEach(id => reachableClaimIds.add(id));
          }
          if (action.type === 'ITEM' && action.item.claimIds) {
            action.item.claimIds.forEach(id => reachableClaimIds.add(id));
          }
        }
      }
    }
  }

  // 2. Aus didaktischen Routen & Optionen
  for (const route of data.routes) {
    if (route.triggerNodeId) {
      reachableNodeIds.add(route.triggerNodeId);
    }
    if (route.disclaimerClaimIds) {
      route.disclaimerClaimIds.forEach(id => reachableClaimIds.add(id));
    }
    for (const opt of route.options) {
      if (opt.perspectiveClaimIds) {
        opt.perspectiveClaimIds.forEach(id => reachableClaimIds.add(id));
      }
      if (opt.targetKnowledgeNodeIds) {
        opt.targetKnowledgeNodeIds.forEach(nId => reachableNodeIds.add(nId));
      }
    }
  }

  // 3. Aus Schauplätzen & Teasern
  for (const loc of data.worldData.locations) {
    if (loc.teaserClaimIds) {
      loc.teaserClaimIds.forEach(id => reachableClaimIds.add(id));
    }
    if (loc.knowledgeNodeIds) {
      loc.knowledgeNodeIds.forEach(nId => reachableNodeIds.add(nId));
    }
  }

  // 4. Aus erreichbaren Knowledge-Nodes
  for (const nodeId of reachableNodeIds) {
    const node = data.nodes.find(n => n.id === nodeId);
    if (node && node.claimIds) {
      node.claimIds.forEach(id => reachableClaimIds.add(id));
    }
  }

  // 5. Aus erreichbaren Relationen (sofern fromNode oder toNode erreichbar ist)
  for (const rel of data.relations) {
    if (reachableNodeIds.has(rel.fromNodeId) || reachableNodeIds.has(rel.toNodeId)) {
      if (rel.claimIds) {
        rel.claimIds.forEach(id => reachableClaimIds.add(id));
      }
    }
  }

  return Array.from(reachableClaimIds);
}

/**
 * Validiert die semantische und strukturelle Integrität des gesamten Wissensgraphen
 */
export function validateKnowledgeGraph(customData?: KnowledgeDatasets): ValidationReport {
  const data = customData || getDefaultDatasets();
  const issues: ValidationIssue[] = [];

  const sourceMap = new Map<string, SourceRecord>();
  const claimMap = new Map<string, ClaimRecord>();
  const nodeMap = new Map<string, KnowledgeNode>();

  // 1. Validierung der Quellen
  for (const src of data.sources) {
    if (sourceMap.has(src.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: src.id,
        message: `Doppelte Source-ID gefunden: ${src.id}`
      });
    }
    sourceMap.set(src.id, src);

    if (src.kind === 'official') {
      if (!src.jurisdiction) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Offizielle Quelle ${src.id} erfordert das Feld 'jurisdiction' (z. B. 'DE').`
        });
      }
      if (!src.url || !src.url.startsWith('http')) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Offizielle Quelle ${src.id} erfordert eine gültige HTTP(S)-URL.`
        });
      }
      if (!src.lastCheckedAt || isNaN(Date.parse(src.lastCheckedAt))) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Offizielle Quelle ${src.id} erfordert ein valides ISO-Prüfdatum in 'lastCheckedAt'.`
        });
      } else {
        const checkDate = new Date(src.lastCheckedAt);
        const today = new Date();
        if (checkDate > today) {
          issues.push({
            level: 'ERROR',
            category: 'CITATION',
            entityId: src.id,
            message: `Prüfdatum 'lastCheckedAt' der Quelle ${src.id} liegt in der Zukunft (${src.lastCheckedAt}).`
          });
        }
      }
    }

    if (src.kind === 'patient-narrative') {
      if (!src.narrativeForm) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Patientennarrativ ${src.id} erfordert ein 'narrativeForm'-Feld.`
        });
      }
      if (!src.valence) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Patientennarrativ ${src.id} erfordert ein 'valence'-Feld ('positive', 'negative' oder 'mixed').`
        });
      }
      if (!src.provenance) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Patientennarrativ ${src.id} erfordert ein 'provenance'-Feld.`
        });
      }
      if (!src.publishedDate || isNaN(Date.parse(src.publishedDate))) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Patientennarrativ ${src.id} erfordert ein 'publishedDate'-Feld.`
        });
      }
      if (!src.locatorOrUrl) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: src.id,
          message: `Patientennarrativ ${src.id} erfordert ein 'locatorOrUrl'-Feld.`
        });
      }
    }
  }

  // 2. Validierung der Claims
  for (const claim of data.claims) {
    if (claimMap.has(claim.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: claim.id,
        message: `Doppelte Claim-ID gefunden: ${claim.id}`
      });
    }
    claimMap.set(claim.id, claim);

    for (const citation of claim.citations) {
      const src = sourceMap.get(citation.sourceId);
      if (!src) {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: claim.id,
          message: `Claim verweist auf unbekannte Source-ID: ${citation.sourceId}`
        });
      } else {
        // Narrative dürfen ausschließlich als 'supports' an 'experience'-Claims hängen
        if (src.kind === 'patient-narrative' && citation.role === 'supports' && claim.type !== 'experience') {
          issues.push({
            level: 'ERROR',
            category: 'CITATION',
            entityId: claim.id,
            message: `Patientennarrativ ${src.id} darf nicht als 'supports' an Nicht-Experience-Claim ${claim.id} (Typ: ${claim.type}) hängen.`
          });
        }
      }
    }

    if ((claim.type === 'definition' || claim.type === 'theory') && claim.evidenceLevel === 'well-supported') {
      issues.push({
        level: 'ERROR',
        category: 'CITATION',
        entityId: claim.id,
        message: `Claim ${claim.id} vom Typ ${claim.type} darf nicht als 'well-supported' deklariert werden.`
      });
    }
  }

  // 3. Validierung der Nodes
  for (const node of data.nodes) {
    if (nodeMap.has(node.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: node.id,
        message: `Doppelte Node-ID gefunden: ${node.id}`
      });
    }
    nodeMap.set(node.id, node);

    for (const cId of node.claimIds) {
      if (!claimMap.has(cId)) {
        issues.push({
          level: 'ERROR',
          category: 'ONTOLOGY',
          entityId: node.id,
          message: `Node verweist auf unbekannte Claim-ID: ${cId}`
        });
      }
    }
  }

  // 4. Validierung der Relationen
  for (const rel of data.relations) {
    if (!nodeMap.has(rel.fromNodeId)) {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: rel.id,
        message: `Relation fromNodeId nicht gefunden: ${rel.fromNodeId}`
      });
    }
    if (!nodeMap.has(rel.toNodeId)) {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: rel.id,
        message: `Relation toNodeId nicht gefunden: ${rel.toNodeId}`
      });
    }
    for (const cId of rel.claimIds) {
      if (!claimMap.has(cId)) {
        issues.push({
          level: 'ERROR',
          category: 'ONTOLOGY',
          entityId: rel.id,
          message: `Relation verweist auf unbekannte Claim-ID: ${cId}`
        });
      }
    }
  }

  // 5. Validierung der Exploration-Routen
  for (const route of data.routes) {
    const triggerNode = nodeMap.get(route.triggerNodeId);
    if (!triggerNode || triggerNode.kind !== 'experience') {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: route.id,
        message: `Route ${route.id} triggerNodeId muss ein existierender Node vom Typ 'experience' sein.`
      });
    }

    if (route.options.length !== 5) {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: route.id,
        message: `Route ${route.id} muss genau 5 Optionen enthalten (aktuell: ${route.options.length}).`
      });
    }

    const seenOptionIds = new Set<string>();
    route.options.forEach((opt, idx) => {
      if (seenOptionIds.has(opt.id)) {
        issues.push({
          level: 'ERROR',
          category: 'ONTOLOGY',
          entityId: opt.id,
          message: `Doppelte Option-ID in Route ${route.id}: ${opt.id}`
        });
      }
      seenOptionIds.add(opt.id);

      // Optionen dürfen NIEMALS direkt auf Approach-Knoten zeigen
      for (const tId of opt.targetKnowledgeNodeIds) {
        const targetNode = nodeMap.get(tId);
        if (!targetNode) {
          issues.push({
            level: 'ERROR',
            category: 'ONTOLOGY',
            entityId: opt.id,
            message: `RouteOption ${opt.id} verweist auf unbekannten Node ${tId}.`
          });
        } else if (targetNode.kind === 'approach') {
          issues.push({
            level: 'ERROR',
            category: 'ONTOLOGY',
            entityId: opt.id,
            message: `RouteOption ${opt.id} darf nicht direkt auf einen 'approach'-Knoten (${tId}) zeigen (Schul-Matching-Verbot).`
          });
        } else if (targetNode.kind !== 'need' && targetNode.kind !== 'working-mode') {
          issues.push({
            level: 'ERROR',
            category: 'ONTOLOGY',
            entityId: opt.id,
            message: `RouteOption ${opt.id} targetKnowledgeNodeIds darf nur 'need' oder 'working-mode' Knoten enthalten (enthält: ${targetNode.kind}).`
          });
        }
      }

      // Optionen 2-5 dürfen kein bookmarkId Property besitzen
      if (idx > 0 && opt.bookmarkId !== undefined) {
        issues.push({
          level: 'ERROR',
          category: 'ONTOLOGY',
          entityId: opt.id,
          message: `RouteOption ${opt.id} (Option ${idx + 1}) darf kein 'bookmarkId'-Property besitzen.`
        });
      }
    });
  }

  // 6. Validierung der Weltkarte & Szenen-Konsistenz
  for (const loc of data.worldData.locations) {
    if (loc.type === 'scene') {
      if (!loc.sceneId || !data.scenesRegistry[loc.sceneId]) {
        issues.push({
          level: 'ERROR',
          category: 'CONSISTENCY',
          entityId: loc.id,
          message: `Begehbare Location ${loc.id} referenziert keine registrierte Szene (${loc.sceneId}).`
        });
      } else {
        const scene = data.scenesRegistry[loc.sceneId];
        if (scene.locationId !== loc.id) {
          issues.push({
            level: 'ERROR',
            category: 'CONSISTENCY',
            entityId: loc.id,
            message: `Szenen-Location-Mismatch: Szene ${scene.id} hat locationId '${scene.locationId}', erwartet '${loc.id}'.`
          });
        }
      }
    }
  }

  // 7. Reachability Traversal & Release-Gate Status
  const reachableClaimIds = getReachableClaimIds(data);
  const reachableDraftClaimIds: string[] = [];

  for (const cId of reachableClaimIds) {
    const claim = claimMap.get(cId);
    if (claim && claim.reviewStatus === 'draft') {
      reachableDraftClaimIds.push(cId);
    }
  }

  const errors = issues.filter(i => i.level === 'ERROR');
  const warnings = issues.filter(i => i.level === 'WARNING');

  let releaseStatus: ValidationReport['releaseStatus'] = 'RELEASE_READY';
  if (errors.length > 0) {
    releaseStatus = 'BLOCKED_BY_VALIDATION_ERRORS';
  } else if (reachableDraftClaimIds.length > 0) {
    releaseStatus = 'BLOCKED_BY_DRAFT_CONTENT';
  }

  return {
    isValid: errors.length === 0,
    releaseStatus,
    errorsCount: errors.length,
    warningsCount: warnings.length,
    reachableClaimIds,
    reachableDraftClaimIds,
    issues
  };
}
