import { KnowledgeRelation } from '../../types';

/**
 * Wissensrelationen mit expliziter Richtungssemantik (fromNodeId -> toNodeId).
 * Hinweis: Die Verbindung `experience -> need + working-mode` entsteht ausschließlich
 * didaktisch durch die explizite Nutzerentscheidung in einer RouteOption.
 */
export const KNOWLEDGE_RELATIONS: KnowledgeRelation[] = [
  // 1. Arbeitsweise -> Prozess (acts-via)
  {
    id: 'rel_action_acts_via_activation',
    fromNodeId: 'node_wm_concrete_action',
    toNodeId: 'node_proc_behavioral_activation',
    type: 'acts-via',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 2. Prozess -> Intervention (realized-by)
  {
    id: 'rel_activation_realized_by_experiment',
    fromNodeId: 'node_proc_behavioral_activation',
    toNodeId: 'node_tech_behavioral_experiment',
    type: 'realized-by',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 3. Intervention -> Ansätze (belongs-to, methodische Einordnung ohne Wirkbehauptung)
  {
    id: 'rel_experiment_to_cbt',
    fromNodeId: 'node_tech_behavioral_experiment',
    toNodeId: 'node_app_cbt',
    type: 'belongs-to',
    claimIds: []
  },
  {
    id: 'rel_chair_to_humanistic',
    fromNodeId: 'node_tech_chair_work',
    toNodeId: 'node_app_humanistic',
    type: 'belongs-to',
    claimIds: []
  },
  {
    id: 'rel_tasks_to_systemic',
    fromNodeId: 'node_tech_systemic_tasks',
    toNodeId: 'node_app_systemic',
    type: 'belongs-to',
    claimIds: []
  },

  // 4. Arbeitsweise -> Reale Passungsprüfung (examines-fit)
  {
    id: 'rel_action_to_fit_collab',
    fromNodeId: 'node_wm_concrete_action',
    toNodeId: 'node_collab_fit_examination',
    type: 'examines-fit',
    claimIds: ['claim_fit_collaboration_dynamic']
  },

  // 5. Passungsprüfung -> Therapeutische Allianz (examines-fit)
  {
    id: 'rel_fit_to_alliance',
    fromNodeId: 'node_collab_fit_examination',
    toNodeId: 'node_collab_therapeutic_alliance',
    type: 'examines-fit',
    claimIds: ['claim_therapeutic_alliance']
  }
];
