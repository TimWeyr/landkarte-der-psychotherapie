import { ExplorationRoute } from '../../types';

export const EXPLORATION_ROUTES: ExplorationRoute[] = [
  {
    id: 'route_rumination_perspectives',
    prompt: 'Welche Herangehensweise oder Frage spricht dich für den nächsten Schritt am ehesten an?',
    triggerNodeId: 'node_exp_constant_rumination',
    disclaimer: 'Das ist kein Test und keine Therapieempfehlung. Die Richtungen helfen dir, mögliche Arbeitsweisen kennenzulernen und Fragen für ein Gespräch mit einer Therapeutin oder einem Therapeuten zu entwickeln.',
    disclaimerClaimIds: ['claim_fit_collaboration_dynamic'],
    options: [
      {
        id: 'opt_concrete_action',
        label: 'Konkrete Strategien & Handlungsmöglichkeiten ausprobieren',
        perspectiveDescription: 'Fokus auf praktisches Handeln im Alltag: Wie kann ich Grübelschleifen durch gezielte Übungen und Experimente unterbrechen?',
        perspectiveClaimIds: ['claim_action_oriented_rumination'],
        targetKnowledgeNodeIds: ['node_need_structure_coping', 'node_wm_concrete_action'],
        bookmarkId: 'bm_initial_interview_question_action'
      },
      {
        id: 'opt_deep_patterns',
        label: 'Tiefere Muster & biografische Auslöser verstehen',
        perspectiveDescription: 'Fokus auf Hintergründe: Welche ungelösten Konflikte oder früheren Erfahrungen nähren meine heutigen Gedankenschleifen?',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: ['node_need_understanding_causes', 'node_wm_deep_patterns']
      },
      {
        id: 'opt_thought_distance',
        label: 'Gedanken mit innerem Abstand begegnen',
        perspectiveDescription: 'Fokus auf Achtsamkeit: Wie lerne ich, Grübelgedanken wahrzunehmen und weiterziehen zu lassen, ohne mich in ihnen zu verfangen?',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: ['node_need_distancing_acceptance', 'node_wm_thought_distance']
      },
      {
        id: 'opt_body_emotion',
        label: 'Körperliche Reaktionen & emotionale Blockaden einbeziehen',
        perspectiveDescription: 'Fokus auf Spüren: Welche körperlichen Spannungen oder verdrängten Gefühle melden sich, wenn das Grübeln beginnt?',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: ['node_need_body_emotion_contact', 'node_wm_body_emotion']
      },
      {
        id: 'opt_social_context',
        label: 'Wechselwirkungen mit Umfeld & Beziehungen betrachten',
        perspectiveDescription: 'Fokus auf Kontext: Welche zwischenmenschlichen Dynamiken, Erwartungen oder Rollenkonflikte halten meine Gedankenschleifen aufrecht?',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: ['node_need_social_orientation', 'node_wm_social_context']
      }
    ]
  }
];
