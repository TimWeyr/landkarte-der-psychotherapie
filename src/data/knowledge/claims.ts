import { ClaimRecord } from '../../types';

export const CLAIMS: ClaimRecord[] = [
  {
    id: 'claim_gba_guidelines',
    statement: 'Die Psychotherapie-Richtlinie des G-BA regelt die im deutschen Kassensystem anerkannten Richtlinienverfahren und die formalen Voraussetzungen der Leistungserbringung, trifft jedoch keine Aussage über die empirische Überlegenheit einzelner methodischer Varianten.',
    publicExplanation: 'Der Gemeinsame Bundesausschuss (G-BA) legt als Selbstverwaltungsorgan fest, welche psychotherapeutischen Verfahren von den gesetzlichen Krankenkassen erstattet werden (Richtlinienverfahren: Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie, systemische Therapie). Dieser sozialrechtliche Zulassungsstatus regelt den Leistungsanspruch, ist jedoch nicht mit einem wissenschaftlichen Ranking therapeutischer Schulen gleichzusetzen.',
    type: 'care-fact',
    citations: [
      {
        sourceId: 'src_gba_psychotherapie_richtlinie',
        role: 'supports',
        locator: '§ 11 & § 13'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_therapeutic_alliance',
    statement: 'Die Qualität der therapeutischen Beziehung (Allianz) ist über verschiedene Therapieschulen hinweg ein robuster statistischer Prädiktor für den Behandlungserfolg.',
    publicExplanation: 'Zahlreiche Metaanalysen belegen, dass eine vertrauensvolle Zusammenarbeit, ein Konsens über Ziele und ein offener Austausch einen wesentlichen Anteil am Therapieergebnis haben.',
    type: 'association',
    citations: [
      {
        sourceId: 'src_horvath_symonds_1991',
        role: 'supports',
        locator: 'S. 142–146'
      }
    ],
    evidenceLevel: 'well-supported',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_evidence_perspectives',
    statement: 'Evidenzbasierte Psychotherapie integriert die beste verfügbare empirische Forschung mit klinischer Expertise und individuellen Merkmalen, Werten und Präferenzen.',
    publicExplanation: 'Wissenschaftliche Orientierung bedeutet nicht das starre Abarbeiten fixer Standardprotokolle, sondern das flexible Abstimmen erprobter Methoden auf die individuelle Person.',
    type: 'definition',
    citations: [
      {
        sourceId: 'src_wampold_imel_2015',
        role: 'background',
        locator: 'Kapitel 1 & 2'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_care_116117_ptv11',
    statement: 'Nach den Regelungen für die ambulante GKV-Psychotherapie müssen vor Beginn probatorischer Sitzungen oder einer Akutbehandlung grundsätzlich mindestens 50 Minuten Psychotherapeutische Sprechstunde stattgefunden haben. Das Formblatt PTV 11 dokumentiert die Ergebnisse der Sprechstunde und die Empfehlungen für das weitere Vorgehen.',
    publicExplanation: 'Über die Terminservicestelle 116 117 können zeitnah Termine für eine Sprechstunde vermittelt werden. Die Sprechstunde ist die reguläre diagnostische Erstabklärung vor einer Richtlinientherapie oder Akutbehandlung. Auf der Informationsseite der KBV werden als Ausnahmen von der vorherigen Sprechstundenpflicht genannt: (1) Eine vorherige stationäre Krankenhaus- oder Rehabilitationsbehandlung aufgrund einer psychischen Erkrankung mit einer ambulant psychotherapeutisch behandelbaren Diagnose sowie (2) ein Therapeutenwechsel während einer laufenden Psychotherapie.',
    type: 'care-fact',
    citations: [
      {
        sourceId: 'src_kbv_terminvermittlung',
        role: 'supports',
        locator: 'Abschnitt Psychotherapeutische Sprechstunde & 116 117'
      },
      {
        sourceId: 'src_kbv_psychotherapie',
        role: 'supports',
        locator: 'Abschnitt Formblatt PTV 11'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft',
    limitations: 'Dies sind die von der Kassenärztlichen Bundesvereinigung (KBV) für den ambulanten Bereich benannten Ausnahmetatbestände von der Sprechstundenpflicht.'
  },
  {
    id: 'claim_care_funding_paths',
    statement: 'Gesetzlich Versicherte haben nach § 13 Abs. 3 Satz 1 SGB V Anspruch auf Erstattung der tatsächlich entstandenen Kosten für eine selbstbeschaffte notwendige Leistung, wenn die Krankenkasse eine unaufschiebbare Leistung nicht rechtzeitig erbringen konnte (Alternative 1) oder eine Leistung zu Unrecht abgelehnt hat (Alternative 2).',
    publicExplanation: 'Voraussetzung ist eine medizinisch notwendige Leistung und bei psychotherapeutischen Leistungen die Qualifikation nach § 95c SGB V (Approbation, Fachkunde). Das Gesetz unterscheidet präzise zwischen Systemversagen bei unaufschiebbarer Leistung (Alt. 1 – ohne vorherige Ablehnungsbescheidspflicht) und rechtswidriger Ablehnung nach ordnungsgemäßem Antrag (Alt. 2).',
    type: 'care-fact',
    citations: [
      {
        sourceId: 'src_sgb5_paragraph13',
        role: 'supports',
        locator: '§ 13 Abs. 3 Satz 1 SGB V i.V.m. § 95c SGB V'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft',
    limitations: '§ 13 Abs. 3 Satz 1 Alt. 1 SGB V setzt eine unaufschiebbare Leistung voraus (d. h. eine Behandlung, deren Aufschub bis zum regulären Kassenplatz unzumutbar ist, was nicht mit einem vital bedrohlichen Notfall verwechselt werden darf). Bei Alt. 2 ist die vorherige fristgerechte Antragstellung und der rechtswidrige Ablehnungsbescheid der Kasse zwingend.'
  },
  {
    id: 'claim_action_oriented_rumination',
    statement: 'In psychotherapeutischen Modellvorstellungen wird handlungsorientiertes Ausprobieren als eine von mehreren möglichen Erkundungsperspektiven zur Unterbrechung von repetitivem Grübeln beschrieben.',
    publicExplanation: 'Problembewältigung und konkrete Handlungsaktivierung werden in der Psychotherapieforschung (z. B. Grawe, 1997) als Arbeitsmodelle diskutiert. Sie bieten einen Handlungsrahmen zum schrittweisen Ausprobieren neuer Erfahrungen im Alltag, stellen jedoch kein isoliertes Wirksamkeitsversprechen dar.',
    type: 'theory',
    citations: [
      {
        sourceId: 'src_grawe_1997',
        role: 'background',
        locator: 'Kapitel Problembewältigung, S. 420–445'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_fit_collaboration_dynamic',
    statement: 'Passung in der Psychotherapie entwickelt sich als partnerschaftlicher Klärungs- und Abstimmungsprozess zwischen Patient und Therapeut.',
    publicExplanation: 'Therapeutische Passung ist keine starre Vorab-Eigenschaft, sondern wird in den ersten probatorischen Sitzungen im gemeinsamen Erproben von Zielen und Arbeitsweisen kontinuierlich überprüft und angepasst.',
    type: 'theory',
    citations: [
      {
        sourceId: 'src_wampold_imel_2015',
        role: 'background',
        locator: 'Kapitel 3, S. 45–68'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_therapist_characteristics_null_finding',
    statement: 'Die 38 in dieser Untersuchung erhobenen Vorabmerkmale von Therapeutinnen und Therapeuten zeigten weitgehend keine statistische Vorhersagekraft für die Behandlungsergebnisse der untersuchten Patientinnen und Patienten.',
    publicExplanation: 'In einer großangelegten, präregistrierten Analyse mit 97 Therapeutinnen/Therapeuten und 6.152 Patientinnen/Patienten sagten die 38 multimodalen Vorab-Merkmale (Persönlichkeit, Bindungsstil, soziale Fertigkeiten) das Therapieergebnis kaum vorher (Goldberg et al., 2026, S. 1–18, Tabellen 2 & 3).',
    type: 'association',
    citations: [
      {
        sourceId: 'src_goldberg_2026_therapist_characteristics',
        role: 'supports',
        locator: 'S. 1–18, insb. Tabellen 2 & 3',
        note: 'Präregistrierte Nullbefunde zu 38 spezifischen statischen Therapeutenmerkmalen'
      }
    ],
    evidenceLevel: 'limited',
    reviewStatus: 'draft',
    limitations: 'Untersuchte ausschließlich 38 statische Vorabmerkmale; keine Aussage über dynamische Prozessmerkmale oder andere Matching-Konzepte (z. B. Präferenz- oder Problem-Matching).'
  }
];
