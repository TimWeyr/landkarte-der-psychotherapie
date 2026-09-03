import { SourceRecord } from '../../types';

export const SOURCES: SourceRecord[] = [
  {
    id: 'src_gba_psychotherapie_richtlinie',
    kind: 'official',
    title: 'Richtlinie des Gemeinsamen Bundesausschusses über die Durchführung der Psychotherapie (Psychotherapie-Richtlinie)',
    authors: 'Gemeinsamer Bundesausschuss (G-BA)',
    year: 2026,
    venue: 'Bundesanzeiger BAnz AT 16.06.2026 B3 (Beschluss vom 19.03.2026, in Kraft getreten am 17.06.2026)',
    url: 'https://www.g-ba.de/richtlinien/20/',
    jurisdiction: 'DE',
    validFrom: '2017-04-01',
    lastCheckedAt: '2026-09-03'
  },
  {
    id: 'src_kbv_psychotherapie',
    kind: 'official',
    title: 'Psychotherapeutische Versorgung im Überblick',
    authors: 'Kassenärztliche Bundesvereinigung (KBV)',
    year: 2026,
    venue: 'KBV Informationsportal Psychotherapie',
    url: 'https://www.kbv.de/psychotherapie',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-09-03'
  },
  {
    id: 'src_kbv_terminvermittlung',
    kind: 'official',
    title: 'Terminvermittlung und Psychotherapeutische Sprechstunde über 116 117',
    authors: 'Kassenärztliche Bundesvereinigung (KBV)',
    year: 2026,
    venue: 'KBV Praxiswissen Terminvermittlung',
    url: 'https://www.kbv.de/praxis/praxisfuehrung/terminvermittlung',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-09-03'
  },
  {
    id: 'src_sgb5_paragraph13',
    kind: 'official',
    title: 'Fünftes Buch Sozialgesetzbuch (SGB V) – Gesetzliche Krankenversicherung, § 13 Kostenerstattung',
    authors: 'Bundesministerium der Justiz / Bundesgesetzgeber',
    year: 2026,
    venue: 'Bundesgesetzblatt (BGBl.)',
    url: 'https://www.gesetze-im-internet.de/sgb_5/__13.html',
    jurisdiction: 'DE',
    lastCheckedAt: '2026-09-03'
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
    id: 'src_wampold_imel_2015',
    kind: 'theory',
    title: 'The Great Psychotherapy Debate: The Evidence for What Makes Psychotherapy Work (2nd ed.)',
    authors: 'Wampold, B. E., & Imel, Z. E.',
    year: 2015,
    venue: 'Routledge / Taylor & Francis',
    peerReviewed: true
  },
  {
    id: 'src_grawe_1997',
    kind: 'theory',
    title: 'Psychologische Therapie (2. Aufl.)',
    authors: 'Grawe, K.',
    year: 1997,
    venue: 'Hogrefe Verlag',
    peerReviewed: true
  },
  {
    id: 'src_goldberg_2026_therapist_characteristics',
    kind: 'primary-study',
    title: 'Multimodal Assessments of Therapist Characteristics Are Largely Unrelated to Patient Outcomes: A Preregistered Analysis',
    authors: 'Goldberg, S. B., et al.',
    year: 2026,
    venue: 'Clinical Psychological Science',
    doi: '10.1177/21677026261424222',
    peerReviewed: true
  }
];
