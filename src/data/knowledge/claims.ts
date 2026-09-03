import { ClaimRecord } from '../../types';

export const CLAIMS: ClaimRecord[] = [
  {
    id: 'claim_gba_guidelines',
    statement: 'Die Psychotherapie-Richtlinie des G-BA regelt die im deutschen Kassensystem anerkannten Richtlinienverfahren und die formalen Schritte zur Kostenübernahme.',
    publicExplanation: 'Der Gemeinsame Bundesausschuss (G-BA) legt fest, welche psychotherapeutischen Behandlungsverfahren von den gesetzlichen Krankenkassen bezahlt werden (aktuell: Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie und systemische Therapie).',
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
    publicExplanation: 'Wissenschaftliche Orientierung bedeutet nicht nur das Abarbeiten fixer Standardprotokolle, sondern das flexible Abstimmen erprobter Methoden auf die individuelle Person.',
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
    statement: 'Die psychotherapeutische Sprechstunde ist der reguläre Einstieg in die ambulante Versorgung; das Formblatt PTV 11 dokumentiert die Ersteinschätzung.',
    publicExplanation: 'Über die Terminservicestelle 116 117 können zeitnah Termine für eine Sprechstunde vermittelt werden. Die Sprechstunde dient der ersten diagnostischen Orientierung, nicht automatisch der festen Therapieplatzzusage.',
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
    reviewStatus: 'draft'
  },
  {
    id: 'claim_care_funding_paths',
    statement: 'Gesetzlich Versicherte haben nach § 13 Abs. 3 Satz 1 SGB V unter bestimmten Voraussetzungen Anspruch auf Kostenerstattung einer selbstbeschafften notwendigen Behandlung.',
    publicExplanation: 'Das Gesetz unterscheidet zwei getrennte Fälle: (1) Eine unaufschiebbare Leistung konnte von der Krankenkasse nicht rechtzeitig erbracht werden, oder (2) eine Leistung wurde zu Unrecht abgelehnt. Erstattet werden die tatsächlich entstandenen Kosten der notwendigen Leistung; behandelnde Psychotherapeutinnen/Psychotherapeuten müssen die Voraussetzungen des § 95c SGB V (Approbation, Fachkunde) erfüllen.',
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
    limitations: 'Vorherige Antragstellung und schriftlicher Ablehnungsbescheid sind Voraussetzung bei Alternative 2; bei akuten unaufschiebbaren Notfällen (Alternative 1) greift der Grundsatz der Systemversagens-Kostenerstattung ohne vorherige Wartepflicht auf einen Ablehnungsbescheid.'
  },
  {
    id: 'claim_action_oriented_rumination',
    statement: 'In psychotherapeutischen Prozessmodellen wird handlungsorientiertes Ausprobieren als Ansatzpunkt zur Unterbrechung von repetitivem Grübeln beschrieben.',
    publicExplanation: 'Problembewältigung und konkrete Handlungsaktivierung werden in der Psychotherapieforschung (z. B. Grawe, 1997) als Perspektiven beschrieben, um passive Gedankenschleifen durch neue Erfahrungen im Handeln schrittweise aufzulösen.',
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
