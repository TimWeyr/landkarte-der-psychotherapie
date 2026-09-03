import { MajorTherapeuticRegion } from '../types/worldMap';

export const MAJOR_REGIONS: MajorTherapeuticRegion[] = [
  {
    id: 'region_central',
    name: 'Zentralregion',
    subtitle: 'Erkundung des therapeutischen Arbeitens (37 Schauplätze)',
    landscapeDescription: 'Ein schulenübergreifender Orientierungsraum im Herzen der Landkarte. Hier erkunden Suchende Gefühle, Gedanken, Körper, Beziehungen, Ressourcen und praktische Übungen, bevor sie sich in spezifische Therapieschulen vertiefen.',
    xPercent: 52.0,
    yPercent: 44.0,
    badgeText: 'Vollständig begehbar • 37 Orte',
    badgeColor: '#c68a35',
    icon: '🧭',
    isCentralRegion: true,
    corePhilosophy: 'Verstehen und Erproben therapeutischer Wirkprozesse unabhängig von Dogmen und Schulengrenzen.',
    historicalRoots: 'Allgemeine Psychotherapie & Wirkfaktorenforschung (Klaus Grawe, Bruce Wampold, Jerome Frank).',
    typicalWorkingModes: [
      'Orientierungskompass für persönliche Einstiegsfragen',
      'Praktisches Erproben von Interventionen in der Werkstatt',
      'Versorgungsinformationen und Patientenrechte am Bahnhof'
    ],
    whatItDoesNotClaim: 'Behauptet nicht, eine eigene eigenständige Therapieschule zu sein, sondern dient als übergeordneter didaktischer Erkundungsraum.',
    futureSubLocations: [
      'Leuchtturm der Evidenz (aktiv)',
      'Werkstatt der Erprobung (aktiv)',
      'Bahnhof der Versorgung (aktiv)',
      '30 weitere Schauplätze im inneren Atlas'
    ]
  },
  {
    id: 'region_cbt',
    name: 'Kognitive Verhaltenstherapie',
    subtitle: 'Struktur, Kognition, Verhalten & Lernen (KVT)',
    landscapeDescription: 'Ein weitläufiger, gut erschlossener Kulturraum im Osten mit klaren Wegen, Werkstätten, Beobachtungstürmen und strukturierten Übungsplätzen. Wege führen sichtbar von Problem über Erprobung zu neuem Verhalten.',
    xPercent: 82.0,
    yPercent: 36.0,
    badgeText: 'Tradition • In Vorbereitung',
    badgeColor: '#446473',
    icon: '⚙️',
    isCentralRegion: false,
    corePhilosophy: 'Psychische Belastungen entstehen und verfestigen sich über erlernte Denk- und Verhaltensmuster. Durch gezieltes Erkennen, Prüfen und praktisches Erproben im Alltag können neue, entlastende Erfahrungen gemacht werden.',
    historicalRoots: 'Behaviorismus (Watson, Skinner), Kognitive Wende (Aaron T. Beck, Albert Ellis) und Dritte Welle (Hayes, Linehan).',
    typicalWorkingModes: [
      'Sokratischer Dialog & Gedankenprüfung',
      'Graduierte Exposition & Verhaltensexperimente',
      'Aktivitätsaufbau & strukturierte Problemlösung',
      'Emotionsregulation & Achtsamkeitselemente'
    ],
    whatItDoesNotClaim: 'Behauptet nicht, dass Gefühle rein durch rationales Denken kontrolliert werden können oder dass KVT für alle Fragestellungen die einzig wirksame Methode sei.',
    futureSubLocations: [
      'Labor der kognitiven Umstrukturierung',
      'Turm der Verhaltensanalyse',
      'Parcours der Reizkonfrontation',
      'Plateau der Dritten Welle (ACT / DBT)'
    ]
  },
  {
    id: 'region_psychoanalysis',
    name: 'Psychoanalyse & Tiefenpsychologie',
    subtitle: 'Biografie, unbewusste Konflikte & historische Schichten',
    landscapeDescription: 'Eine ehrwürdige, geschichtete Gebirgs- und Archivlandschaft im Nordwesten. Tieferliegende Bibliotheken, Höhlen, Felsenschluchten und Aussichtstürme verbinden Vergangenheit und Gegenwart miteinander.',
    xPercent: 22.0,
    yPercent: 24.0,
    badgeText: 'Tradition • In Vorbereitung',
    badgeColor: '#5a5043',
    icon: '🏛️',
    isCentralRegion: false,
    corePhilosophy: 'Heutige Symptome und Beziehungsschwierigkeiten wurzeln oft in unbewussten Konflikten, frühen Beziehungserfahrungen und Schutzmechanismen. Durch das Verstehen und Durcharbeiten in der therapeutischen Beziehung wird innere Reifung möglich.',
    historicalRoots: 'Psychoanalyse (Sigmund Freud), Ich-Psychologie, Objektbeziehungstheorie (Klein, Winnicott), Selbstpsychologie (Kohut) und moderne relationale Psychoanalyse.',
    typicalWorkingModes: [
      'Freie Assoziation & Traumdeutung',
      'Bearbeitung von Übertragung und Gegenübertragung',
      'Verstehen von Abwehrmechanismen und Widerstand',
      'Fokus auf unbewusste Beziehungs- und Konfliktmuster'
    ],
    whatItDoesNotClaim: 'Behauptet nicht, dass jede Therapie jahrelang im Liegen stattfinden muss oder dass Menschen passive Opfer ihrer Kindheit bleiben.',
    futureSubLocations: [
      'Archiv der unbewussten Konflikte',
      'Kammer der Träume und Symbole',
      'Schlucht der Übertragung',
      'Krypta der frühen Bindungsmuster'
    ]
  },
  {
    id: 'region_systemic',
    name: 'Systemische Therapie',
    subtitle: 'Netzwerke, Beziehungen, Rollen & Kontexte',
    landscapeDescription: 'Ein vielschichtiges, lebendiges Siedlungsensemble im Südwesten aus miteinander verbundenen Häusern, hölzernen Bogenbrücken über Flussläufe und gemeinschaftlichen Plätzen mit Blickachsen zwischen allen Bewohnern.',
    xPercent: 30.0,
    yPercent: 78.0,
    badgeText: 'Tradition • In Vorbereitung',
    badgeColor: '#b25838',
    icon: '🕸️',
    isCentralRegion: false,
    corePhilosophy: 'Symptome werden nicht isoliert im Individuum verortet, sondern als sinnhafte Reaktionen auf Dynamiken, Rollen und Regeln im familiären, partnerschaftlichen oder sozialen Bezugssystem verstanden.',
    historicalRoots: 'Kybernetik, Kommunikationstheorie (Watzlawick), Mailänder Modell (Selvini Palazzoli), Heidelberger Schule (Stierlin) und lösungsfokussierte Ansätze (de Shazer).',
    typicalWorkingModes: [
      'Zirkuläres Fragen & Perspektivenwechsel',
      'Genogrammarbeit & Mehrgenerationenperspektive',
      'Familien- und Systemskulpturen im Raum',
      'Ressourcen- und lösungsorientierte Interventionen'
    ],
    whatItDoesNotClaim: 'Macht Familienmitglieder nicht pauschal zu Schuldigen und behauptet nicht, dass Angehörige immer zwingend in jeder Sitzung anwesend sein müssen.',
    futureSubLocations: [
      'Hof der Mehrgenerationen-Genogramme',
      'Platz der zirkulären Fragen',
      'Werkstatt der Systemskulpturen',
      'Brücke der familiären Loyalitäten'
    ]
  },
  {
    id: 'region_humanistic',
    name: 'Personzentrierte & Humanistische Psychotherapie',
    subtitle: 'Begegnung, Selbstaktualisierung, Emotion & Erleben',
    landscapeDescription: 'Ein offener, sonnendurchfluteter Natur- und Gartenraum im Westen mit Pavillons, lichten Hainen, Wasserläufen und geschützten Sitzplätzen für echte Zwischenmenschlichkeit und inneres Spüren.',
    xPercent: 18.0,
    yPercent: 48.0,
    badgeText: 'Tradition • In Vorbereitung',
    badgeColor: '#50755a',
    icon: '🌿',
    isCentralRegion: false,
    corePhilosophy: 'Jeder Mensch trägt eine angeborene Tendenz zur Selbstverwirklichung und Heilung in sich. In einem Klima bedingungsloser Wertschätzung, Empathie und Echtheit kann der Zugang zum eigenen organismischen Erleben wiedergefunden werden.',
    historicalRoots: 'Gesprächspsychotherapie (Carl Rogers), Gestalttherapie (Fritz & Laura Perls), Logotherapie (Viktor Frankl) und moderne Emotionsfokussierte Therapie (Leslie Greenberg).',
    typicalWorkingModes: [
      'Empathische Resonanz & aktives Zuhören',
      'Focusing & Kontakt mit dem Felt Sense',
      'Gestalttherapeutische Stuhldialoge & Experimente',
      'Arbeit mit existenziellen Grundfragen und Werten'
    ],
    whatItDoesNotClaim: 'Ist keine unverbindliche Wellness oder passives Abwarten, sondern eine methodisch hochpräzise, erfahrungsintensive Prozessbegleitung.',
    futureSubLocations: [
      'Garten der Rogers-Begegnung',
      'Pavillon des Felt Sense (Focusing)',
      'Atelier der Gestalt-Experimente',
      'Lichtung der existenziellen Sinnfragen'
    ]
  }
];

export function getMajorRegionById(id: string): MajorTherapeuticRegion | undefined {
  return MAJOR_REGIONS.find(r => r.id === id);
}
