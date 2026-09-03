import { KnowledgeNode } from '../../types';

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // 1. Subjektives Erleben
  {
    id: 'node_exp_constant_rumination',
    kind: 'experience',
    name: 'Ständiges Grübeln & Gedankenkreisen',
    shortDescription: 'Wiederkehrende, schwer kontrollierbare Gedankenschleifen ohne unmittelbare Handlungsentlastung.',
    detailedDescription: 'Betroffene erleben oft, dass der Versuch, Probleme rein im Kopf zu lösen, die Anspannung verstärkt statt sie zu mindern.',
    claimIds: ['claim_action_oriented_rumination']
  },

  // 2. Gewünschte Arbeitsweisen & Perspektiven
  {
    id: 'node_wm_concrete_action',
    kind: 'working-mode',
    name: 'Konkrete Strategien & Handlungsmöglichkeiten ausprobieren',
    shortDescription: 'Praktisches Erproben neuer Verhaltensweisen, strukturierte Übungen und Experimente zwischen den Sitzungen.',
    detailedDescription: 'Schulübergreifend nutzen KVT, Gestalttherapie und systemische Ansätze handlungsorientierte Aufgaben, um neue korrigierende Erfahrungen zu ermöglichen.',
    claimIds: ['claim_action_oriented_rumination', 'claim_fit_collaboration_dynamic']
  },
  {
    id: 'node_wm_deep_patterns',
    kind: 'working-mode',
    name: 'Tiefere Muster & biografische Auslöser verstehen',
    shortDescription: 'Erforschen von unbewussten Konflikten, Bindungserfahrungen und wiederkehrenden Lebensmustern.',
    detailedDescription: 'Hilft zu verstehen, warum bestimmte Gefühle oder Reaktionen in der Gegenwart so intensiv auftreten.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'node_wm_thought_distance',
    kind: 'working-mode',
    name: 'Gedanken mit innerem Abstand begegnen',
    shortDescription: 'Lernen, Gedanken als vorübergehende mentale Ereignisse zu betrachten statt als unumstößliche Fakten.',
    detailedDescription: 'Umfasst kognitive Defusion, Achtsamkeit und metakognitive Strategien.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'node_wm_body_emotion',
    kind: 'working-mode',
    name: 'Körperliche Reaktionen & emotionale Blockaden einbeziehen',
    shortDescription: 'Wahrnehmung somatischer Signale, Emotionsregulation und Spüren innerer Zustände.',
    detailedDescription: 'Fokussiert das Erleben im Hier und Jetzt und die Regulation des Nervensystems.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'node_wm_social_context',
    kind: 'working-mode',
    name: 'Wechselwirkungen mit Umfeld & Beziehungen betrachten',
    shortDescription: 'Blick auf soziale Rollen, familiäre Dynamiken, Partnerschaft und Arbeitskontexte.',
    detailedDescription: 'Versteht Beschwerden nicht isoliert, sondern im Geflecht zwischenmenschlicher Systeme.',
    claimIds: ['claim_evidence_perspectives']
  },

  // 3. Spezifische Interventionen & Techniken
  {
    id: 'node_tech_behavioral_experiment',
    kind: 'intervention',
    name: 'Verhaltensexperimente & Realitätsprüfungen',
    shortDescription: 'Gezieltes Ausprobieren im Alltag, um automatische Befürchtungen empirisch zu überprüfen.',
    detailedDescription: 'Ein Kernwerkzeug der KVT: Statt nur über Sorgen zu sprechen, wird überprüft, was tatsächlich passiert.',
    claimIds: ['claim_action_oriented_rumination']
  },
  {
    id: 'node_tech_chair_work',
    kind: 'intervention',
    name: 'Erlebnisorientierte Stuhldialoge',
    shortDescription: 'Innere Anteile oder Konfliktpartner im Raum auf Stühlen platzieren und in Dialog bringen.',
    detailedDescription: 'Ursprünglich aus der Gestalttherapie, heute weit verbreitet in Schematherapie und integrativer KVT.',
    claimIds: ['claim_evidence_perspectives']
  },
  {
    id: 'node_tech_systemic_tasks',
    kind: 'intervention',
    name: 'Systemische Beobachtungs- & Erprobungsaufgaben',
    shortDescription: 'Kleine Verhaltensänderungen im Alltag ausprobieren, um Reaktionen im sozialen System zu beobachten.',
    detailedDescription: 'Fördert Neugier und unterbricht festgefahrene Beziehungsmuster.',
    claimIds: ['claim_evidence_perspectives']
  },

  // 4. Therapieansätze (als übergeordnete Traditionen)
  {
    id: 'node_app_cbt',
    kind: 'approach',
    name: 'Kognitive Verhaltenstherapie (KVT)',
    shortDescription: 'Fokus auf Zusammenhänge von Gedanken, Gefühlen und Handlungen mit starkem Gegenwarts- und Übungsbezug.',
    claimIds: ['claim_gba_guidelines']
  },
  {
    id: 'node_app_psychodynamic',
    kind: 'approach',
    name: 'Psychodynamische Psychotherapie',
    shortDescription: 'Fokus auf unbewusste Konflikte, Beziehungsmuster und biografische Prägungen.',
    claimIds: ['claim_gba_guidelines']
  },
  {
    id: 'node_app_systemic',
    kind: 'approach',
    name: 'Systemische Therapie',
    shortDescription: 'Fokus auf soziale Systeme, Kommunikationsmuster, Rollen und Ressourcen.',
    claimIds: ['claim_gba_guidelines']
  },
  {
    id: 'node_app_humanistic',
    kind: 'approach',
    name: 'Humanistische & Erlebnisorientierte Verfahren',
    shortDescription: 'Fokus auf Selbstentfaltung, emotionale Klärung, Empathie und gegenwärtiges Erleben.',
    claimIds: ['claim_evidence_perspectives']
  },

  // 5. Versorgungs- und Kooperationswissen
  {
    id: 'node_care_consultation_116117',
    kind: 'care-structure',
    name: 'Psychotherapeutische Sprechstunde (116 117)',
    shortDescription: 'Niedrigschwelliger Erstzugang zur diagnostischen Abklärung im ambulanten System.',
    claimIds: ['claim_care_116117_ptv11']
  },
  {
    id: 'node_care_funding_paths',
    kind: 'care-structure',
    name: 'Abrechnungs- & Kostenerstattungswege',
    shortDescription: 'Gesetzliche Krankenversicherung, Kostenerstattung nach § 13 Abs. 3 SGB V und Privatabrechnung.',
    claimIds: ['claim_care_funding_paths']
  },
  {
    id: 'node_collab_therapeutic_alliance',
    kind: 'collaboration',
    name: 'Therapeutische Allianz & Beziehungsgestaltung',
    shortDescription: 'Die vertrauensvolle Zusammenarbeit und gemeinsame Zielabstimmung als universeller Wirkfaktor.',
    claimIds: ['claim_therapeutic_alliance']
  },
  {
    id: 'node_collab_fit_examination',
    kind: 'collaboration',
    name: 'Gemeinsame Passungsprüfung im Erstgespräch',
    shortDescription: 'Praktisches Klären von Arbeitsstil, Erwartungen und gegenseitiger Sympathie vor Therapiebeginn.',
    claimIds: ['claim_fit_collaboration_dynamic', 'claim_therapeutic_alliance']
  }
];
