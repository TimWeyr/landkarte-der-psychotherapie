import { ClaimRecord } from '../../types';

export const CLAIMS: ClaimRecord[] = [
  {
    id: 'claim_gba_guidelines',
    type: 'care-fact',
    statement: 'In Deutschland sind Richtlinienverfahren durch den Gemeinsamen Bundesausschuss (G-BA) rechtlich für die vertragsärztliche Versorgung anerkannt.',
    publicExplanation: 'Der G-BA legt verbindlich fest, welche Psychotherapieverfahren von den gesetzlichen Krankenkassen bezahlt werden (Verhaltenstherapie, Tiefenpsychologisch fundierte Psychotherapie, Analytische Psychotherapie, Systemische Therapie).',
    citations: [
      {
        sourceId: 'src_gba_psychotherapie_richtlinie',
        role: 'supports',
        locator: '§ 11 & § 13',
        note: 'Aufzählung und Anerkennungsvoraussetzungen der Richtlinienverfahren'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft',
    scope: 'GKV-Versorgung in Deutschland'
  },
  {
    id: 'claim_therapeutic_alliance',
    type: 'association',
    statement: 'Die Qualität der therapeutischen Beziehung (Allianz) ist ein robuster Prädiktor für den Behandlungserfolg, unabhängig von der Therapieschule.',
    publicExplanation: 'Zahlreiche Metaanalysen zeigen, dass ein tragfähiges Arbeitsbündnis zwischen Patient und Therapeut über verschiedene Verfahren hinweg messbar mit positiven Behandlungsergebnissen korreliert.',
    citations: [
      {
        sourceId: 'src_horvath_symonds_1991',
        role: 'supports',
        locator: 'S. 142–146',
        note: 'Metaanalyse über 24 Studien zur Allianz-Outcome-Korrelation'
      },
      {
        sourceId: 'src_wampold_imel_2015',
        role: 'supports',
        locator: 'Kapitel 3, S. 45–68',
        note: 'Einordnung im Common-Factors-Modell'
      }
    ],
    evidenceLevel: 'well-supported',
    reviewStatus: 'draft',
    limitations: 'Allianz ist ein Prädiktor/Korrelat, begründet jedoch keine alleinige Kausalität.'
  },
  {
    id: 'claim_evidence_perspectives',
    type: 'definition',
    statement: 'Evidenzbasierte Psychotherapie verbindet systematische empirische Wirksamkeitsforschung mit klinischer Expertise und Patientenwerten.',
    publicExplanation: 'Wissenschaftliche Studien liefern fundierte Leitplanken über wirksame Mechanismen. Die konkrete Anwendung erfordert immer das Zusammenspiel mit dem individuellen Fallverständnis und der persönlichen Passung.',
    citations: [
      {
        sourceId: 'src_wampold_imel_2015',
        role: 'supports',
        locator: 'Kapitel 1 & 2',
        note: 'Definition von Evidenzbasierung im Kontext psychologischer Interventionen'
      }
    ],
    evidenceLevel: 'well-supported',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_care_116117_ptv11',
    type: 'care-fact',
    statement: 'Die Psychotherapeutische Sprechstunde ist der reguläre Einstieg in die ambulante GKV-Versorgung und wird über die 116 117 oder direkt beim Therapeuten vereinbart.',
    publicExplanation: 'In der Sprechstunde erfolgt eine erste Abklärung und die Ausstellung des Formblatts PTV 11, auf dem vermerkt wird, ob eine ambulante Therapie empfohlen wird.',
    citations: [
      {
        sourceId: 'src_kbv_terminservicestelle_2024',
        role: 'supports',
        locator: 'Abschnitt: Ablauf der Sprechstunde',
        note: 'Offizielle Regelung zur Terminservicestelle und Formblatt PTV 11'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft',
    scope: 'Gesetzliche Krankenversicherung Deutschland'
  },
  {
    id: 'claim_care_funding_paths',
    type: 'care-fact',
    statement: 'Neben Therapeuten mit Kassensitz existiert bei unzumutbar langen Wartezeiten das Kostenerstattungsverfahren nach § 13 Abs. 3 SGB V.',
    publicExplanation: 'Wenn gesetzlich Versicherte nachweislich keinen rechtzeitigen Kassenplatz finden, können die Kosten für eine Behandlung in einer Privatpraxis unter bestimmten Voraussetzungen erstattet werden.',
    citations: [
      {
        sourceId: 'src_sgb5_paragraph13',
        role: 'supports',
        locator: '§ 13 Abs. 3 SGB V',
        note: 'Gesetzliche Grundlage der Kostenerstattung bei Systemversagen'
      }
    ],
    evidenceLevel: 'not-applicable',
    reviewStatus: 'draft',
    scope: 'GKV Deutschland'
  },
  {
    id: 'claim_action_oriented_rumination',
    type: 'process',
    statement: 'Konkrete handlungsorientierte Übungen und Verhaltensexperimente können helfen, repetitive kognitive Grübelschleifen zu unterbrechen.',
    publicExplanation: 'Durch gezieltes Ausprobieren im Alltag (z.B. Aktivitätenaufbau, Exposition, Stuhldialoge) wird der Fokus von passivem Grübeln auf neue, korrigierende Handlungserfahrungen verlagert.',
    citations: [
      {
        sourceId: 'src_grawe_1997',
        role: 'supports',
        locator: 'Kapitel: Problembewältigung und Problemaktualisierung',
        note: 'Theoretische und empirische Wirkmechanismen handlungsorientierter Verfahren'
      },
      {
        sourceId: 'src_narrative_rumination_action_2025',
        role: 'background',
        locator: 'Synthesebericht S. 4–7',
        note: 'Subjektive Berichte von Betroffenen über den Wert praktischer Übungen'
      }
    ],
    evidenceLevel: 'well-supported',
    reviewStatus: 'draft'
  },
  {
    id: 'claim_fit_collaboration_dynamic',
    type: 'theory',
    statement: 'Therapeutische Passung ist keine statische Vorab-Eigenschaft, sondern ein dynamischer Prozess der gemeinsamen Abstimmung.',
    publicExplanation: 'Ob eine Methode oder ein Arbeitsstil hilfreich ist, entscheidet sich in der kontinuierlichen Rückmeldung und gemeinsamen Zielklärung zwischen Patient und Behandler.',
    citations: [
      {
        sourceId: 'src_goldberg_2026_prognostic',
        role: 'supports',
        locator: 'Diskussion S. 12–15',
        note: 'Grenzen statischer Prognosemodelle und Bedeutung kontinuierlicher Verlaufsbeobachtung'
      }
    ],
    evidenceLevel: 'limited',
    reviewStatus: 'draft'
  }
];
