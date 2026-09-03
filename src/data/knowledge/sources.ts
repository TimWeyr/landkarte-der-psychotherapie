import { SourceRecord } from '../../types';

export const SOURCES: SourceRecord[] = [
  {
    id: 'src_gba_psychotherapie_richtlinie',
    kind: 'official',
    title: 'Richtlinie des Gemeinsamen Bundesausschusses über die Durchführung der Psychotherapie (Psychotherapie-Richtlinie)',
    authors: 'Gemeinsamer Bundesausschuss (G-BA)',
    year: 2023,
    venue: 'Bundesanzeiger AT 05.04.2023 B2',
    url: 'https://www.g-ba.de/richtlinien/20/',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-03-01',
    validFrom: '2017-04-01'
  },
  {
    id: 'src_kbv_terminservicestelle_2024',
    kind: 'official',
    title: 'Leitfaden zur Terminservicestelle 116 117 und Psychotherapeutischen Sprechstunde (Formblatt PTV 11)',
    authors: 'Kassenärztliche Bundesvereinigung (KBV)',
    year: 2024,
    venue: 'KBV Praxisinformationen',
    url: 'https://www.kbv.de/html/psychotherapie.php',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-03-01'
  },
  {
    id: 'src_sgb5_paragraph13',
    kind: 'official',
    title: 'Sozialgesetzbuch (SGB) Fünftes Buch (V) - Gesetzliche Krankenversicherung - § 13 Abs. 3 Kostenerstattung',
    authors: 'Bundesministerium für Gesundheit (BMG)',
    year: 2024,
    venue: 'Gesetze im Internet',
    url: 'https://www.gesetze-im-internet.de/sgb_5/__13.html',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-03-01'
  },
  {
    id: 'src_wampold_imel_2015',
    kind: 'theory',
    title: 'The Great Psychotherapy Debate: The Evidence for What Makes Psychotherapy Work (2nd ed.)',
    authors: 'Wampold, B. E., & Imel, Z. E.',
    year: 2015,
    venue: 'Routledge / Psychology Press',
    doi: '10.4324/9780203582015',
    peerReviewed: true
  },
  {
    id: 'src_horvath_symonds_1991',
    kind: 'systematic-review',
    title: 'Relation between working alliance and outcome in psychotherapy: A meta-analysis',
    authors: 'Horvath, A. O., & Symonds, B. D.',
    year: 1991,
    venue: 'Journal of Counseling Psychology, 38(2), 139–149',
    doi: '10.1037/0022-0167.38.2.139',
    peerReviewed: true
  },
  {
    id: 'src_grawe_1997',
    kind: 'theory',
    title: 'Psychologische Therapie',
    authors: 'Grawe, K.',
    year: 1997,
    venue: 'Hogrefe Verlag',
    peerReviewed: true
  },
  {
    id: 'src_goldberg_2026_prognostic',
    kind: 'primary-study',
    title: 'Dynamic prognostic modeling in naturalistic psychotherapy: Precision vs. clinical flexibility',
    authors: 'Goldberg, S. B., et al.',
    year: 2026,
    venue: 'Journal of Consulting and Clinical Psychology',
    doi: '10.1037/ccp0000890',
    peerReviewed: true
  },
  {
    id: 'src_narrative_rumination_action_2025',
    kind: 'patient-narrative',
    title: 'Erfahrungsstimmen zu handlungsorientierten Schritten bei ständigen Grübelschleifen',
    year: 2025,
    venue: 'Qualitative Synthese strukturierter Patienteninterviews',
    narrativeForm: 'composite',
    platform: 'Forschungssynthese Patientenperspektiven',
    lastCheckedAt: '2026-03-01'
  }
];
