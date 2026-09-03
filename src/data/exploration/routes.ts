import { ExplorationRoute } from '../../types';

export const EXPLORATION_ROUTES: ExplorationRoute[] = [
  {
    id: 'route_rumination_perspectives',
    triggerNodeId: 'node_exp_constant_rumination',
    prompt: 'Welche Arbeitsweise oder Frage spricht dich für den nächsten Schritt am ehesten an?',
    disclaimer: 'Das ist kein Test und keine Therapieempfehlung. Die Richtungen helfen dir, mögliche Arbeitsweisen kennenzulernen und Fragen für ein Gespräch mit einer Therapeutin oder einem Therapeuten zu entwickeln.',
    disclaimerClaimIds: ['claim_fit_collaboration_dynamic'],
    options: [
      {
        id: 'opt_action_experiments',
        label: '1. Konkrete Strategien & Handlungsmöglichkeiten ausprobieren',
        perspectiveDescription: 'Fokus auf praktisches Erproben im Alltag, strukturierte Übungen, Verhaltensanalysen und Stuhldialoge – schulenübergreifend genutzt in KVT, Gestalttherapie und systemischer Praxis.',
        perspectiveClaimIds: ['claim_action_oriented_rumination', 'claim_fit_collaboration_dynamic'],
        targetKnowledgeNodeIds: [
          'node_wm_concrete_action',
          'node_tech_behavioral_experiment',
          'node_tech_chair_work',
          'node_collab_fit_examination'
        ],
        bookmarkId: 'bm_initial_interview_question_action'
      },
      {
        id: 'opt_deep_patterns',
        label: '2. Tiefere Muster & biografische Auslöser verstehen',
        perspectiveDescription: 'Fokus auf unbewusste Konflikte, Bindungserfahrungen und wiederkehrende Lebensthemen – beispielhaft vertreten in psychodynamischen und schematherapeutischen Ansätzen.',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: [
          'node_wm_deep_patterns',
          'node_app_psychodynamic'
        ],
        bookmarkId: 'bm_initial_interview_question_patterns'
      },
      {
        id: 'opt_thought_distance',
        label: '3. Gedanken mit innerem Abstand begegnen',
        perspectiveDescription: 'Fokus auf kognitive Defusion, Achtsamkeit und Akzeptanz – Gedanken als vorübergehende mentale Ereignisse betrachten (z.B. in der Akzeptanz- und Commitment-Therapie ACT).',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: [
          'node_wm_thought_distance'
        ],
        bookmarkId: 'bm_initial_interview_question_distance'
      },
      {
        id: 'opt_body_emotion',
        label: '4. Körperliche Reaktionen & emotionale Blockaden einbeziehen',
        perspectiveDescription: 'Fokus auf somatische Wahrnehmung, Emotionsregulation und das Spüren innerer Zustände – vertreten in emotionsfokussierten und körperorientierten Verfahren.',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: [
          'node_wm_body_emotion'
        ],
        bookmarkId: 'bm_initial_interview_question_body'
      },
      {
        id: 'opt_social_context',
        label: '5. Wechselwirkungen mit Umfeld & Beziehungen betrachten',
        perspectiveDescription: 'Fokus auf soziale Rollen, familiäre Kontexte, Kommunikation und Ressourcen – vertreten in systemischen und interpersonellen Ansätzen.',
        perspectiveClaimIds: ['claim_evidence_perspectives'],
        targetKnowledgeNodeIds: [
          'node_wm_social_context',
          'node_app_systemic'
        ],
        bookmarkId: 'bm_initial_interview_question_social'
      }
    ]
  }
];
