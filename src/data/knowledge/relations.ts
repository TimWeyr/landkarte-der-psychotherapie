import { KnowledgeRelation } from '../../types';

export const KNOWLEDGE_RELATIONS: KnowledgeRelation[] = [
  {
    id: 'rel_rumination_to_action',
    sourceNodeId: 'node_wm_concrete_action',
    targetNodeId: 'node_exp_constant_rumination',
    relationType: 'explores-aspect',
    description: 'Handlungsorientiertes Erproben bietet einen konkreten Gegenpol zu passivem Gedankenkreisen.',
    claimIds: ['claim_action_oriented_rumination']
  },
  {
    id: 'rel_action_to_behavioral_exp',
    sourceNodeId: 'node_tech_behavioral_experiment',
    targetNodeId: 'node_wm_concrete_action',
    relationType: 'implements',
    description: 'Verhaltensexperimente setzen die handlungsorientierte Arbeitsweise im Alltag um.',
    claimIds: ['claim_action_oriented_rumination']
  },
  {
    id: 'rel_action_to_chair_work',
    sourceNodeId: 'node_tech_chair_work',
    targetNodeId: 'node_wm_concrete_action',
    relationType: 'implements',
    description: 'Stuhlarbeit bringt innere Konflikte ins konkrete Handeln und Erleben im Therapieraum.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'rel_action_to_systemic_tasks',
    sourceNodeId: 'node_tech_systemic_tasks',
    targetNodeId: 'node_wm_concrete_action',
    relationType: 'implements',
    description: 'Systemische Aufgaben erproben kleine Verhaltensänderungen im sozialen Umfeld.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'rel_exp_to_cbt',
    sourceNodeId: 'node_tech_behavioral_experiment',
    targetNodeId: 'node_app_cbt',
    relationType: 'belongs-to',
    description: 'Verhaltensexperimente stammen historisch aus der KVT-Tradition.',
    claimIds: ['claim_gba_guidelines']
  },
  {
    id: 'rel_chair_to_humanistic',
    sourceNodeId: 'node_tech_chair_work',
    targetNodeId: 'node_app_humanistic',
    relationType: 'belongs-to',
    description: 'Stuhlarbeit entstammt der humanistischen Gestalttherapie und wird heute schulenübergreifend genutzt.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'rel_systemic_tasks_to_systemic',
    sourceNodeId: 'node_tech_systemic_tasks',
    targetNodeId: 'node_app_systemic',
    relationType: 'belongs-to',
    description: 'Beobachtungsaufgaben sind ein Kernbestandteil systemischer Praxis.',
    claimIds: ['claim_gba_guidelines']
  },
  {
    id: 'rel_action_to_fit',
    sourceNodeId: 'node_wm_concrete_action',
    targetNodeId: 'node_collab_fit_examination',
    relationType: 'examines-fit',
    description: 'Im Erstgespräch wird gemeinsam erprobt, ob und wie intensiv handlungsorientiert gearbeitet werden soll.',
    claimIds: ['claim_fit_collaboration_dynamic']
  },
  {
    id: 'rel_fit_to_alliance',
    sourceNodeId: 'node_collab_fit_examination',
    targetNodeId: 'node_collab_therapeutic_alliance',
    relationType: 'examines-fit',
    description: 'Die gemeinsame Klärung von Arbeitsweise und Zielen stärkt das therapeutische Arbeitsbündnis.',
    claimIds: ['claim_therapeutic_alliance']
  }
];
