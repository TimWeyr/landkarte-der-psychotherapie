import { SOURCES } from '../data/knowledge/sources';
import { CLAIMS } from '../data/knowledge/claims';
import { KNOWLEDGE_NODES } from '../data/knowledge/nodes';
import { KNOWLEDGE_RELATIONS } from '../data/knowledge/relations';
import { EXPLORATION_ROUTES } from '../data/exploration/routes';
import { WORLD_DATA } from '../data/worldData';
import { SCENES_REGISTRY } from '../data/scenes';

export interface ValidationError {
  entityType: 'SOURCE' | 'CLAIM' | 'NODE' | 'RELATION' | 'ROUTE' | 'LOCATION' | 'SCENE';
  entityId: string;
  field?: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ValidationReport {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  releaseStatus: 'RELEASE_READY' | 'BLOCKED_BY_DRAFT_CONTENT' | 'BLOCKED_BY_ERRORS';
  stats: {
    sourcesCount: number;
    claimsCount: number;
    draftClaimsCount: number;
    approvedClaimsCount: number;
    nodesCount: number;
    relationsCount: number;
    routesCount: number;
  };
}

export function validateKnowledgeGraph(): ValidationReport {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Sets for duplicate detection & reference resolution
  const sourceIds = new Set<string>();
  const claimIds = new Set<string>();
  const nodeIds = new Set<string>();
  const relationIds = new Set<string>();
  const routeIds = new Set<string>();
  const locationIds = new Set<string>();

  // 1. Validate Sources
  for (const src of SOURCES) {
    if (sourceIds.has(src.id)) {
      errors.push({ entityType: 'SOURCE', entityId: src.id, message: `Doppelte Source-ID: ${src.id}`, severity: 'ERROR' });
    }
    sourceIds.add(src.id);

    if (!src.title) {
      errors.push({ entityType: 'SOURCE', entityId: src.id, field: 'title', message: 'Quelle benötigt einen Titel', severity: 'ERROR' });
    }

    if (src.kind === 'official' && !src.jurisdiction) {
      warnings.push({ entityType: 'SOURCE', entityId: src.id, field: 'jurisdiction', message: 'Offizielle Quelle sollte eine Jurisdiction (z.B. DE) besitzen', severity: 'WARNING' });
    }

    if (src.kind === 'patient-narrative' && !src.narrativeForm) {
      errors.push({ entityType: 'SOURCE', entityId: src.id, field: 'narrativeForm', message: 'Patienten-Narrative müssen eine NarrativeForm angeben', severity: 'ERROR' });
    }
  }

  // 2. Validate Claims
  let draftClaimsCount = 0;
  let approvedClaimsCount = 0;

  for (const claim of CLAIMS) {
    if (claimIds.has(claim.id)) {
      errors.push({ entityType: 'CLAIM', entityId: claim.id, message: `Doppelte Claim-ID: ${claim.id}`, severity: 'ERROR' });
    }
    claimIds.add(claim.id);

    if (claim.reviewStatus === 'draft') draftClaimsCount++;
    if (claim.reviewStatus === 'approved') approvedClaimsCount++;

    if (!claim.statement || !claim.publicExplanation) {
      errors.push({ entityType: 'CLAIM', entityId: claim.id, message: 'Claim benötigt statement und publicExplanation', severity: 'ERROR' });
    }

    if (claim.citations.length === 0) {
      errors.push({ entityType: 'CLAIM', entityId: claim.id, message: 'Claim muss mindestens eine Citation besitzen', severity: 'ERROR' });
    }

    for (const cit of claim.citations) {
      if (!sourceIds.has(cit.sourceId)) {
        errors.push({ entityType: 'CLAIM', entityId: claim.id, field: 'citations', message: `Referenzierte Source-ID '${cit.sourceId}' existiert nicht`, severity: 'ERROR' });
      } else {
        const src = SOURCES.find(s => s.id === cit.sourceId);
        // Narrative cannot be 'supports' for effectiveness claims
        if (src?.kind === 'patient-narrative' && cit.role === 'supports' && (claim.type === 'effectiveness' || claim.evidenceLevel === 'well-supported')) {
          errors.push({
            entityType: 'CLAIM',
            entityId: claim.id,
            field: 'citations',
            message: `Patienten-Narrativ '${cit.sourceId}' darf nicht als Wirksamkeitsbeleg ('supports') für einen Claim verwendet werden`,
            severity: 'ERROR'
          });
        }
      }
    }
  }

  // 3. Validate Knowledge Nodes
  for (const node of KNOWLEDGE_NODES) {
    if (nodeIds.has(node.id)) {
      errors.push({ entityType: 'NODE', entityId: node.id, message: `Doppelte Node-ID: ${node.id}`, severity: 'ERROR' });
    }
    nodeIds.add(node.id);

    for (const cId of node.claimIds) {
      if (!claimIds.has(cId)) {
        errors.push({ entityType: 'NODE', entityId: node.id, field: 'claimIds', message: `Referenzierte Claim-ID '${cId}' existiert nicht`, severity: 'ERROR' });
      }
    }
  }

  // 4. Validate Knowledge Relations
  for (const rel of KNOWLEDGE_RELATIONS) {
    if (relationIds.has(rel.id)) {
      errors.push({ entityType: 'RELATION', entityId: rel.id, message: `Doppelte Relation-ID: ${rel.id}`, severity: 'ERROR' });
    }
    relationIds.add(rel.id);

    if (!nodeIds.has(rel.sourceNodeId)) {
      errors.push({ entityType: 'RELATION', entityId: rel.id, field: 'sourceNodeId', message: `Source-Node '${rel.sourceNodeId}' existiert nicht`, severity: 'ERROR' });
    }
    if (!nodeIds.has(rel.targetNodeId)) {
      errors.push({ entityType: 'RELATION', entityId: rel.id, field: 'targetNodeId', message: `Target-Node '${rel.targetNodeId}' existiert nicht`, severity: 'ERROR' });
    }

    if (rel.claimIds) {
      for (const cId of rel.claimIds) {
        if (!claimIds.has(cId)) {
          errors.push({ entityType: 'RELATION', entityId: rel.id, field: 'claimIds', message: `Referenzierte Claim-ID '${cId}' in Relation existiert nicht`, severity: 'ERROR' });
        }
      }
    }
  }

  // 5. Validate Exploration Routes
  for (const route of EXPLORATION_ROUTES) {
    if (routeIds.has(route.id)) {
      errors.push({ entityType: 'ROUTE', entityId: route.id, message: `Doppelte Route-ID: ${route.id}`, severity: 'ERROR' });
    }
    routeIds.add(route.id);

    if (!nodeIds.has(route.triggerNodeId)) {
      errors.push({ entityType: 'ROUTE', entityId: route.id, field: 'triggerNodeId', message: `Trigger-Node '${route.triggerNodeId}' existiert nicht`, severity: 'ERROR' });
    }

    if (route.disclaimerClaimIds) {
      for (const cId of route.disclaimerClaimIds) {
        if (!claimIds.has(cId)) {
          errors.push({ entityType: 'ROUTE', entityId: route.id, field: 'disclaimerClaimIds', message: `Disclaimer Claim-ID '${cId}' existiert nicht`, severity: 'ERROR' });
        }
      }
    }

    for (const opt of route.options) {
      for (const nId of opt.targetKnowledgeNodeIds) {
        if (!nodeIds.has(nId)) {
          errors.push({ entityType: 'ROUTE', entityId: route.id, field: 'targetKnowledgeNodeIds', message: `Option '${opt.id}' referenziert nicht existierenden Node '${nId}'`, severity: 'ERROR' });
        }
      }
      if (opt.perspectiveClaimIds) {
        for (const cId of opt.perspectiveClaimIds) {
          if (!claimIds.has(cId)) {
            errors.push({ entityType: 'ROUTE', entityId: route.id, field: 'perspectiveClaimIds', message: `Option '${opt.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
          }
        }
      }
    }
  }

  // 6. Validate World Locations
  for (const loc of WORLD_DATA.locations) {
    if (locationIds.has(loc.id)) {
      errors.push({ entityType: 'LOCATION', entityId: loc.id, message: `Doppelte Location-ID: ${loc.id}`, severity: 'ERROR' });
    }
    locationIds.add(loc.id);

    if (loc.knowledgeNodeIds) {
      for (const nId of loc.knowledgeNodeIds) {
        if (!nodeIds.has(nId)) {
          errors.push({ entityType: 'LOCATION', entityId: loc.id, field: 'knowledgeNodeIds', message: `Location '${loc.id}' referenziert nicht existierenden Node '${nId}'`, severity: 'ERROR' });
        }
      }
    }

    if (loc.teaserClaimIds) {
      for (const cId of loc.teaserClaimIds) {
        if (!claimIds.has(cId)) {
          errors.push({ entityType: 'LOCATION', entityId: loc.id, field: 'teaserClaimIds', message: `Location '${loc.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
        }
      }
    }
  }

  // 7. Validate Scenes
  for (const [sceneId, scene] of Object.entries(SCENES_REGISTRY)) {
    if (!locationIds.has(scene.locationId)) {
      errors.push({ entityType: 'SCENE', entityId: sceneId, field: 'locationId', message: `Szene '${sceneId}' verweist auf ungültige Location-ID '${scene.locationId}'`, severity: 'ERROR' });
    }

    for (const hotspot of scene.hotspots) {
      if (hotspot.dialogue.claimIds) {
        for (const cId of hotspot.dialogue.claimIds) {
          if (!claimIds.has(cId)) {
            errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${hotspot.id}`, field: 'claimIds', message: `Hotspot '${hotspot.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
          }
        }
      }
      if (hotspot.dialogue.subtextClaimIds) {
        for (const cId of hotspot.dialogue.subtextClaimIds) {
          if (!claimIds.has(cId)) {
            errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${hotspot.id}`, field: 'subtextClaimIds', message: `Hotspot '${hotspot.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
          }
        }
      }

      for (const action of hotspot.dialogue.actions) {
        if (action.claimIds) {
          for (const cId of action.claimIds) {
            if (!claimIds.has(cId)) {
              errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${action.id}`, field: 'action.claimIds', message: `Aktion '${action.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
            }
          }
        }
        if (action.type === 'NAVIGATE_ROUTES') {
          if (!routeIds.has(action.routeId)) {
            errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${action.id}`, field: 'routeId', message: `Aktion '${action.id}' referenziert nicht existierende Route '${action.routeId}'`, severity: 'ERROR' });
          }
        }
        if (action.type === 'QUIZ' && action.quiz.explanationClaimIds) {
          for (const cId of action.quiz.explanationClaimIds) {
            if (!claimIds.has(cId)) {
              errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${action.id}`, field: 'explanationClaimIds', message: `Quiz '${action.id}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
            }
          }
        }
        if (action.type === 'ITEM' && action.item.claimIds) {
          for (const cId of action.item.claimIds) {
            if (!claimIds.has(cId)) {
              errors.push({ entityType: 'SCENE', entityId: `${sceneId}:${action.id}`, field: 'item.claimIds', message: `Item '${action.item.itemId}' referenziert nicht existierenden Claim '${cId}'`, severity: 'ERROR' });
            }
          }
        }
      }
    }
  }

  let releaseStatus: 'RELEASE_READY' | 'BLOCKED_BY_DRAFT_CONTENT' | 'BLOCKED_BY_ERRORS' = 'RELEASE_READY';
  if (errors.length > 0) {
    releaseStatus = 'BLOCKED_BY_ERRORS';
  } else if (draftClaimsCount > 0) {
    releaseStatus = 'BLOCKED_BY_DRAFT_CONTENT';
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    releaseStatus,
    stats: {
      sourcesCount: SOURCES.length,
      claimsCount: CLAIMS.length,
      draftClaimsCount,
      approvedClaimsCount,
      nodesCount: KNOWLEDGE_NODES.length,
      relationsCount: KNOWLEDGE_RELATIONS.length,
      routesCount: EXPLORATION_ROUTES.length
    }
  };
}
