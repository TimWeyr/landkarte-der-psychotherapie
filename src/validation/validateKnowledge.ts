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
 * Zyklensicherer BFS-Reachability-Traversal über alle erreichbaren UI-Einstiegspunkte und Relationen
 */
export function getReachableClaimIds(data: KnowledgeDatasets): string[] {
  const reachableClaimIds = new Set<string>();
  const visitedNodeIds = new Set<string>();
  const nodeQueue: string[] = [];

  const addClaim = (id?: string) => {
    if (id) reachableClaimIds.add(id);
  };
  const addClaims = (ids?: string[]) => {
    if (ids) ids.forEach(id => addClaim(id));
  };

  // 1. Wurzelknoten aus Schauplätzen und Teasern
  for (const loc of data.worldData.locations) {
    addClaims(loc.teaserClaimIds);
    if (loc.knowledgeNodeIds) {
      for (const nId of loc.knowledgeNodeIds) {
        if (!visitedNodeIds.has(nId)) {
          visitedNodeIds.add(nId);
          nodeQueue.push(nId);
        }
      }
    }
  }

  // 2. Wurzelknoten aus Szenen, Dialogen, Subtexten, Quizzen und Items
  for (const scene of Object.values(data.scenesRegistry)) {
    for (const hotspot of scene.hotspots) {
      addClaims(hotspot.dialogue.claimIds);
      addClaims(hotspot.dialogue.subtextClaimIds);
      if (hotspot.dialogue.actions) {
        for (const action of hotspot.dialogue.actions) {
          addClaims(action.claimIds);
          if (action.type === 'QUIZ') {
            addClaims(action.quiz.explanationClaimIds);
          }
          if (action.type === 'ITEM' && action.item) {
            addClaims(action.item.claimIds);
          }
        }
      }
    }
  }

  // 3. Wurzelknoten aus didaktischen Routen & Perspektiven
  for (const route of data.routes) {
    addClaims(route.disclaimerClaimIds);
    if (route.triggerNodeId && !visitedNodeIds.has(route.triggerNodeId)) {
      visitedNodeIds.add(route.triggerNodeId);
      nodeQueue.push(route.triggerNodeId);
    }
    for (const opt of route.options) {
      addClaims(opt.perspectiveClaimIds);
      for (const nId of opt.targetKnowledgeNodeIds) {
        if (!visitedNodeIds.has(nId)) {
          visitedNodeIds.add(nId);
          nodeQueue.push(nId);
        }
      }
    }
  }

  // 4. Claims der initialen Wurzelknoten aufnehmen
  for (const nId of Array.from(visitedNodeIds)) {
    const node = data.nodes.find(n => n.id === nId);
    if (node) {
      addClaims(node.claimIds);
    }
  }

  // 5. Zyklensichere BFS-Traversierung über gerichtete Relationen (fromNodeId -> toNodeId)
  while (nodeQueue.length > 0) {
    const currentNodeId = nodeQueue.shift()!;
    const outgoingRelations = data.relations.filter(r => r.fromNodeId === currentNodeId);

    for (const rel of outgoingRelations) {
      addClaims(rel.claimIds);
      const targetNodeId = rel.toNodeId;
      const targetNode = data.nodes.find(n => n.id === targetNodeId);

      if (targetNode) {
        addClaims(targetNode.claimIds);
        if (!visitedNodeIds.has(targetNodeId)) {
          visitedNodeIds.add(targetNodeId);
          nodeQueue.push(targetNodeId);
        }
      }
    }
  }

  return Array.from(reachableClaimIds);
}

/**
 * Validiert sämtliche Entitäten und Referenzen fail-closed
 */
export function validateKnowledgeGraph(customData?: KnowledgeDatasets): ValidationReport {
  const data = customData || getDefaultDatasets();
  const issues: ValidationIssue[] = [];

  const sourceMap = new Map<string, SourceRecord>();
  const claimMap = new Map<string, ClaimRecord>();
  const nodeMap = new Map<string, KnowledgeNode>();
  const relationMap = new Map<string, KnowledgeRelation>();
  const routeMap = new Map<string, ExplorationRoute>();
  const optionMap = new Map<string, string>(); // optId -> routeId
  const locationMap = new Map<string, import('../types').LocationNode>();
  const sceneMap = new Map<string, Scene>();
  const hotspotMap = new Map<string, string>(); // hotspotId -> sceneId
  const actionMap = new Map<string, string>(); // actionId -> hotspotId

  // Helper zum Prüfen von Claim-Referenzen
  const checkClaimExists = (claimId: string, context: string, entityId: string) => {
    if (!claimMap.has(claimId)) {
      issues.push({
        level: 'ERROR',
        category: 'CITATION',
        entityId,
        message: `${context} verweist auf unbekannte Claim-ID: ${claimId}`
      });
    }
  };

  // Helper zum Prüfen von Node-Referenzen
  const checkNodeExists = (nodeId: string, context: string, entityId: string) => {
    if (!nodeMap.has(nodeId)) {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId,
        message: `${context} verweist auf unbekannte Node-ID: ${nodeId}`
      });
    }
  };

  // 1. Quellen-Integrität
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

  // 2. Claim-Integrität & Zitierungsprüfung
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
      } else if (src.kind === 'patient-narrative' && citation.role === 'supports' && claim.type !== 'experience') {
        issues.push({
          level: 'ERROR',
          category: 'CITATION',
          entityId: claim.id,
          message: `Patientennarrativ ${src.id} darf nicht als 'supports' an Nicht-Experience-Claim ${claim.id} hängen.`
        });
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

  // 3. Node-Integrität
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
      checkClaimExists(cId, 'KnowledgeNode', node.id);
    }
  }

  // 4. Relations-Integrität
  for (const rel of data.relations) {
    if (relationMap.has(rel.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: rel.id,
        message: `Doppelte Relation-ID gefunden: ${rel.id}`
      });
    }
    relationMap.set(rel.id, rel);

    checkNodeExists(rel.fromNodeId, 'Relation fromNodeId', rel.id);
    checkNodeExists(rel.toNodeId, 'Relation toNodeId', rel.id);

    for (const cId of rel.claimIds) {
      checkClaimExists(cId, 'Relation', rel.id);
    }
  }

  // 5. Exploration-Routen & Optionen
  for (const route of data.routes) {
    if (routeMap.has(route.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: route.id,
        message: `Doppelte Route-ID gefunden: ${route.id}`
      });
    }
    routeMap.set(route.id, route);

    const triggerNode = nodeMap.get(route.triggerNodeId);
    if (!triggerNode || triggerNode.kind !== 'experience') {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: route.id,
        message: `Route ${route.id} triggerNodeId muss ein existierender Node vom Typ 'experience' sein.`
      });
    }

    if (route.disclaimerClaimIds) {
      for (const cId of route.disclaimerClaimIds) {
        checkClaimExists(cId, 'Route disclaimerClaimIds', route.id);
      }
    }

    if (route.options.length !== 5) {
      issues.push({
        level: 'ERROR',
        category: 'ONTOLOGY',
        entityId: route.id,
        message: `Route ${route.id} muss genau 5 Optionen enthalten (aktuell: ${route.options.length}).`
      });
    }

    route.options.forEach((opt, idx) => {
      if (optionMap.has(opt.id)) {
        issues.push({
          level: 'ERROR',
          category: 'INTEGRITY',
          entityId: opt.id,
          message: `Doppelte Option-ID gefunden: ${opt.id}`
        });
      }
      optionMap.set(opt.id, route.id);

      if (opt.perspectiveClaimIds) {
        for (const cId of opt.perspectiveClaimIds) {
          checkClaimExists(cId, `RouteOption perspectiveClaimIds`, opt.id);
        }
      }

      let hasNeed = false;
      let hasWorkingMode = false;

      for (const tId of opt.targetKnowledgeNodeIds) {
        const targetNode = nodeMap.get(tId);
        if (!targetNode) {
          issues.push({
            level: 'ERROR',
            category: 'ONTOLOGY',
            entityId: opt.id,
            message: `RouteOption ${opt.id} verweist auf unbekannten Node ${tId}.`
          });
        } else {
          if (targetNode.kind === 'need') hasNeed = true;
          if (targetNode.kind === 'working-mode') hasWorkingMode = true;
          if (targetNode.kind === 'approach') {
            issues.push({
              level: 'ERROR',
              category: 'ONTOLOGY',
              entityId: opt.id,
              message: `RouteOption ${opt.id} darf nicht direkt auf einen 'approach'-Knoten (${tId}) zeigen (Schul-Matching-Verbot).`
            });
          }
        }
      }

      if (!hasNeed || !hasWorkingMode) {
        issues.push({
          level: 'ERROR',
          category: 'ONTOLOGY',
          entityId: opt.id,
          message: `RouteOption ${opt.id} muss mindestens einen 'need'- und mindestens einen 'working-mode'-Knoten enthalten.`
        });
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

  // 6. Locations & Weltkarte
  for (const loc of data.worldData.locations) {
    if (locationMap.has(loc.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: loc.id,
        message: `Doppelte Location-ID gefunden: ${loc.id}`
      });
    }
    locationMap.set(loc.id, loc);

    if (loc.teaserClaimIds) {
      for (const cId of loc.teaserClaimIds) {
        checkClaimExists(cId, `Location teaserClaimIds`, loc.id);
      }
    }

    if (loc.knowledgeNodeIds) {
      for (const nId of loc.knowledgeNodeIds) {
        checkNodeExists(nId, `Location knowledgeNodeIds`, loc.id);
      }
    }

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

  // 7. Szenen, Hotspots und Actions
  for (const [sceneKey, scene] of Object.entries(data.scenesRegistry)) {
    if (sceneMap.has(scene.id)) {
      issues.push({
        level: 'ERROR',
        category: 'INTEGRITY',
        entityId: scene.id,
        message: `Doppelte Scene-ID gefunden: ${scene.id}`
      });
    }
    sceneMap.set(scene.id, scene);

    const matchingLoc = data.worldData.locations.find(l => l.id === scene.locationId);
    if (!matchingLoc) {
      issues.push({
        level: 'ERROR',
        category: 'CONSISTENCY',
        entityId: scene.id,
        message: `Verwaiste Szene: Szene ${scene.id} verweist auf unbekannte locationId '${scene.locationId}'.`
      });
    } else if (matchingLoc.type !== 'scene' || matchingLoc.sceneId !== scene.id) {
      issues.push({
        level: 'ERROR',
        category: 'CONSISTENCY',
        entityId: scene.id,
        message: `Inkonsistenz: Location ${matchingLoc.id} verweist nicht korrekt auf Szene ${scene.id}.`
      });
    }

    for (const hotspot of scene.hotspots) {
      if (hotspotMap.has(hotspot.id)) {
        issues.push({
          level: 'ERROR',
          category: 'INTEGRITY',
          entityId: hotspot.id,
          message: `Doppelte Hotspot-ID gefunden: ${hotspot.id} (in Szene ${scene.id})`
        });
      }
      hotspotMap.set(hotspot.id, scene.id);

      if (hotspot.dialogue.claimIds) {
        for (const cId of hotspot.dialogue.claimIds) {
          checkClaimExists(cId, `Hotspot dialogue.claimIds`, hotspot.id);
        }
      }
      if (hotspot.dialogue.subtextClaimIds) {
        for (const cId of hotspot.dialogue.subtextClaimIds) {
          checkClaimExists(cId, `Hotspot dialogue.subtextClaimIds`, hotspot.id);
        }
      }

      if (hotspot.dialogue.actions) {
        for (const action of hotspot.dialogue.actions) {
          if (actionMap.has(action.id)) {
            issues.push({
              level: 'ERROR',
              category: 'INTEGRITY',
              entityId: action.id,
              message: `Doppelte Action-ID gefunden: ${action.id} (in Hotspot ${hotspot.id})`
            });
          }
          actionMap.set(action.id, hotspot.id);

          if (action.claimIds) {
            for (const cId of action.claimIds) {
              checkClaimExists(cId, `Action claimIds`, action.id);
            }
          }

          if (action.type === 'QUIZ' && action.quiz.explanationClaimIds) {
            for (const cId of action.quiz.explanationClaimIds) {
              checkClaimExists(cId, `Quiz explanationClaimIds`, action.id);
            }
          }

          if (action.type === 'ITEM' && action.item && action.item.claimIds) {
            for (const cId of action.item.claimIds) {
              checkClaimExists(cId, `Item claimIds`, action.id);
            }
          }
        }
      }
    }
  }

  // 8. Reachability Traversal & Release-Gate Status
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
