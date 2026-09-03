import { KnowledgeRelation } from '../../types';

export const KNOWLEDGE_RELATIONS: KnowledgeRelation[] = [
  // 1. Erleben -> Bedürfnis
  {
    id: 'rel_rumination_evokes_coping',
    fromNodeId: 'node_exp_constant_rumination',
    toNodeId: 'node_need_structure_coping',
    type: 'evokes-need',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 2. Bedürfnis -> Arbeitsweise
  {
    id: 'rel_need_addresses_action',
    fromNodeId: 'node_need_structure_coping',
    toNodeId: 'node_wm_concrete_action',
    type: 'addresses-need',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 3. Arbeitsweise -> Prozess
  {
    id: 'rel_action_acts_via_activation',
    fromNodeId: 'node_wm_concrete_action',
    toNodeId: 'node_proc_behavioral_activation',
    type: 'acts-via',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 4. Prozess -> Intervention (realized-by)
  {
    id: 'rel_activation_realized_by_experiment',
    fromNodeId: 'node_proc_behavioral_activation',
    toNodeId: 'node_tech_behavioral_experiment',
    type: 'realized-by',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 5. Intervention -> Ansätze (cross-school)
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

  // 6. Arbeitsweise -> Reale Passungsprüfung
  {
    id: 'rel_action_to_fit_collab',
    fromNodeId: 'node_wm_concrete_action',
    toNodeId: 'node_collab_fit_examination',
    type: 'examines-fit',
    claimIds: ['claim_fit_collaboration_dynamic']
  },

  // 7. Passungsprüfung -> Therapeutische Allianz
  {
    id: 'rel_fit_to_alliance',
    fromNodeId: 'node_collab_fit_examination',
    toNodeId: 'node_collab_therapeutic_alliance',
    type: 'examines-fit',
    claimIds: ['claim_therapeutic_alliance']
  }
];
