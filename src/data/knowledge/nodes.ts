import { KnowledgeNode } from '../../types';

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // 1. Subjektives Erleben (Experience)
  {
    id: 'node_exp_constant_rumination',
    kind: 'experience',
    title: 'Ständiges Grübeln & Gedankenkreisen',
    plainDescription: 'Das Gefühl, von repetitiven Gedankenschleifen blockiert zu sein und nicht zur Ruhe zu kommen.',
    claimIds: ['claim_action_oriented_rumination'],
    tags: ['erleben', 'gedanken', 'grübeln']
  },

  // 2. Bedürfnis- & Zielebene (Need)
  {
    id: 'node_need_structure_coping',
    kind: 'need',
    title: 'Wunsch nach konkreter Handlungsfähigkeit',
    plainDescription: 'Das Anliegen, praktische Schritte zu erproben und aktive Bewältigungsstrategien aufzubauen.',
    claimIds: ['claim_action_oriented_rumination'],
    tags: ['bedürfnis', 'handlung', 'struktur']
  },
  {
    id: 'node_need_understanding_causes',
    kind: 'need',
    title: 'Wunsch nach Verstehen tieferer Ursachen',
    plainDescription: 'Das Anliegen, biografische Hintergründe und wiederkehrende Lebensmuster einzuordnen.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['bedürfnis', 'biografie', 'ursachen']
  },
  {
    id: 'node_need_distancing_acceptance',
    kind: 'need',
    title: 'Wunsch nach innerem Abstand zu Gedanken',
    plainDescription: 'Das Anliegen, Grübelschleifen zu beobachten, ohne sich von ihnen mitreißen zu lassen.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['bedürfnis', 'abstand', 'achtsamkeit']
  },
  {
    id: 'node_need_body_emotion_contact',
    kind: 'need',
    title: 'Wunsch nach Spüren und Regulieren von Emotionen',
    plainDescription: 'Das Anliegen, körperliche Signale und emotionale Blockaden wahrzunehmen und zu bearbeiten.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['bedürfnis', 'körper', 'emotion']
  },
  {
    id: 'node_need_social_orientation',
    kind: 'need',
    title: 'Wunsch nach Klärung von Beziehungen & Rollen',
    plainDescription: 'Das Anliegen, interpersonelle Konflikte und familiäre Dynamiken zu ordnen.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['bedürfnis', 'beziehungen', 'kontext']
  },
  {
    id: 'node_need_orientation_clarity',
    kind: 'need',
    title: 'Wunsch nach Orientierung im Versorgungssystem',
    plainDescription: 'Das Anliegen, formale Wege, Sprechstunden und Kostenübernahmen zu verstehen.',
    claimIds: ['claim_care_116117_ptv11', 'claim_care_funding_paths'],
    tags: ['bedürfnis', 'versorgung', 'kasse']
  },

  // 3. Gewünschte Arbeitsweisen (Working Mode)
  {
    id: 'node_wm_concrete_action',
    kind: 'working-mode',
    title: 'Konkrete Strategien & Handlungen ausprobieren',
    plainDescription: 'Fokus auf praktisches Handeln, Verhaltensexperimente und strukturierte Übungen im Alltag.',
    claimIds: ['claim_action_oriented_rumination', 'claim_fit_collaboration_dynamic'],
    tags: ['arbeitsweise', 'praxis', 'übung']
  },
  {
    id: 'node_wm_deep_patterns',
    kind: 'working-mode',
    title: 'Tiefere Muster & biografische Auslöser erforschen',
    plainDescription: 'Fokus auf unbewusste Dynamiken, Bindungserfahrungen und lebensgeschichtliche Zusammenhänge.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['arbeitsweise', 'biografie', 'muster']
  },
  {
    id: 'node_wm_thought_distance',
    kind: 'working-mode',
    title: 'Gedanken mit innerem Abstand begegnen',
    plainDescription: 'Fokus auf Achtsamkeit, Akzeptanz und das Lösen von Gedankenverhaftungen (Defusion).',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['arbeitsweise', 'achtsamkeit', 'distanz']
  },
  {
    id: 'node_wm_body_emotion',
    kind: 'working-mode',
    title: 'Körperliche Reaktionen & Emotionen einbeziehen',
    plainDescription: 'Fokus auf somatische Wahrnehmung, Emotionsregulation und gefühlsfokussiertes Arbeiten.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['arbeitsweise', 'körper', 'affekt']
  },
  {
    id: 'node_wm_social_context',
    kind: 'working-mode',
    title: 'Wechselwirkungen mit Beziehungen & Umfeld betrachten',
    plainDescription: 'Fokus auf Beziehungsmuster, Rollenerwartungen und familiäre Kommunikationskreise.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['arbeitsweise', 'beziehungen', 'system']
  },

  // 4. Prozess-Ebene (Process)
  {
    id: 'node_proc_behavioral_activation',
    kind: 'process',
    title: 'Verhaltensaktivierung & Erprobung',
    plainDescription: 'Gezieltes Unterbrechen von Vermeidung und Rückzug durch schrittweises Handeln.',
    claimIds: ['claim_action_oriented_rumination'],
    tags: ['prozess', 'aktivierung']
  },
  {
    id: 'node_proc_schema_exploration',
    kind: 'process',
    title: 'Klärung biografischer Schemata',
    plainDescription: 'Erkennen und Verstehen automatischer emotionaler und kognitiver Erlebensmuster.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['prozess', 'schema']
  },
  {
    id: 'node_proc_defusion',
    kind: 'process',
    title: 'Kognitive Defusion & Metakognition',
    plainDescription: 'Gedanken als mentale Ereignisse betrachten, statt sie als absolute Realität zu behandeln.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['prozess', 'defusion']
  },

  // 5. Interventionen & Methoden (Intervention)
  {
    id: 'node_tech_behavioral_experiment',
    kind: 'intervention',
    title: 'Verhaltensexperimente',
    plainDescription: 'Hypothesen im realen Alltag durch gezieltes Beobachten und aktives Ausprobieren überprüfen.',
    claimIds: ['claim_action_oriented_rumination'],
    tags: ['intervention', 'kvt', 'erprobung']
  },
  {
    id: 'node_tech_chair_work',
    kind: 'intervention',
    title: 'Stuhlarbeit & Dialogtechniken',
    plainDescription: 'Innere Anteile und widersprüchliche Gefühlszustände räumlich im Raum erfahrbar machen.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['intervention', 'gestalt', 'schema']
  },
  {
    id: 'node_tech_systemic_tasks',
    kind: 'intervention',
    title: 'Systemische Beobachtungsaufgaben',
    plainDescription: 'Rückmeldungen und Muster im eigenen Umfeld durch gezielte Beobachtungen erkunden.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['intervention', 'systemisch']
  },

  // 6. Therapieansätze (Approach)
  {
    id: 'node_app_cbt',
    kind: 'approach',
    title: 'Verhaltenstherapie (KVT)',
    plainDescription: 'Schwerpunkt auf aktuellen Denk- und Verhaltensmustern und deren gezielter Modifikation.',
    claimIds: ['claim_gba_guidelines'],
    tags: ['ansatz', 'richtlinienverfahren', 'kvt']
  },
  {
    id: 'node_app_psychodynamic',
    kind: 'approach',
    title: 'Psychodynamische Psychotherapie',
    plainDescription: 'Schwerpunkt auf unbewussten Konflikten, Übertragung und lebensgeschichtlichen Zusammenhängen.',
    claimIds: ['claim_gba_guidelines'],
    tags: ['ansatz', 'richtlinienverfahren', 'psychodynamik']
  },
  {
    id: 'node_app_systemic',
    kind: 'approach',
    title: 'Systemische Therapie',
    plainDescription: 'Schwerpunkt auf Wechselwirkungen in Beziehungen, Rollen und sozialen Kontexten.',
    claimIds: ['claim_gba_guidelines'],
    tags: ['ansatz', 'richtlinienverfahren', 'systemik']
  },
  {
    id: 'node_app_humanistic',
    kind: 'approach',
    title: 'Humanistische Therapieverfahren',
    plainDescription: 'Schwerpunkt auf Selbstentfaltung, innerem Erleben und Ganzheitlichkeit.',
    claimIds: ['claim_evidence_perspectives'],
    tags: ['ansatz', 'humanistisch', 'gestalt']
  },

  // 7. Versorgungsstrukturen (Care Structure)
  {
    id: 'node_care_consultation_116117',
    kind: 'care-structure',
    title: 'Psychotherapeutische Sprechstunde & 116 117',
    plainDescription: 'Die offizielle Anlaufstelle zur Erstabklärung und Erhalt des Formblatts PTV 11.',
    claimIds: ['claim_care_116117_ptv11'],
    tags: ['versorgung', 'sprechstunde', 'erstkontakt']
  },
  {
    id: 'node_care_funding_paths',
    kind: 'care-structure',
    title: 'Abrechnungs- & Kostenerstattungswege',
    plainDescription: 'GKV-Kassensitz, Kostenerstattung nach § 13 Abs. 3 SGB V und Privatabrechnung.',
    claimIds: ['claim_care_funding_paths'],
    tags: ['versorgung', 'kostenerstattung', 'krankenkasse']
  },

  // 8. Reale Zusammenarbeit (Collaboration)
  {
    id: 'node_collab_fit_examination',
    kind: 'collaboration',
    title: 'Gemeinsame Passungsprüfung im Erstgespräch',
    plainDescription: 'Partnerschaftliches Klären von Zielen, Methoden und Arbeitsweisen in probatorischen Sitzungen.',
    claimIds: ['claim_fit_collaboration_dynamic', 'claim_therapist_characteristics_null_finding'],
    tags: ['passung', 'probatorik', 'erstgespräch']
  },
  {
    id: 'node_collab_therapeutic_alliance',
    kind: 'collaboration',
    title: 'Die Therapeutische Beziehung (Allianz)',
    plainDescription: 'Schulenübergreifender Wirkfaktor: Vertrauen, gemeinsame Zielvereinbarung und offener Dialog.',
    claimIds: ['claim_therapeutic_alliance'],
    tags: ['allianz', 'wirkfaktor', 'beziehung']
  }
];
