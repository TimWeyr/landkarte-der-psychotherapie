import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface LocationAssetDef {
  id: string;
  name: string;
  landscape: string;
  motif: string;
  landmarkIconType: string;
  colorAccent: string;
  sceneTheme: {
    bgSky: string;
    bgGround: string;
    focalObjects: string[];
    details: string;
  };
}

const LOCATIONS: LocationAssetDef[] = [
  // A. Wetter des Erlebens
  {
    id: 'loc_thought_windmill',
    name: 'Windmühle der Gedanken',
    landscape: 'Wetter des Erlebens',
    motif: 'Historische Windmühle mit endlosen Bändern im Wind',
    landmarkIconType: 'windmill',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#c8d6df',
      bgGround: '#a5b5a2',
      focalObjects: ['Alte Windmühle mit Holzflügeln', 'Webrahmen mit flatternden Papierbändern', 'Schützende Wetterhütte', 'Wegweiser im Wind'],
      details: 'Windige Hügelkuppe, flatternde Bänder aus handgeschöpftem Papier, drehende Zahnräder.'
    }
  },
  {
    id: 'loc_fog_marsh',
    name: 'Nebelmoor der Erschöpfung',
    landscape: 'Wetter des Erlebens',
    motif: 'Stilles Moor mit sicherem Holzsteg und Laternen',
    landmarkIconType: 'marsh_lantern',
    colorAccent: '#6b7d7f',
    sceneTheme: {
      bgSky: '#d2d7d9',
      bgGround: '#8c9c8e',
      focalObjects: ['Begehbarer Holzbohlensteg', 'Warme Messinglaternen auf Pfählen', 'Sich lichtende Nebelschleier', 'Rastplattform mit Holzbänken'],
      details: 'Ruhige Moorlandschaft, sanftes diffuses Licht, sicherer Halt über dem feuchten Boden.'
    }
  },
  {
    id: 'loc_alarm_cliffs',
    name: 'Alarmklippen',
    landscape: 'Wetter des Erlebens',
    motif: 'Windige Klippen mit Wetterstation und Signalflaggen',
    landmarkIconType: 'cliffs_station',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#d8c2b5',
      bgGround: '#8a796e',
      focalObjects: ['Wetterstation auf Felsvorsprung', 'Farbige Signalflaggen im Wind', 'Geschützte Beobachtungshütte mit Fernglas', 'Massives Holzgeländer'],
      details: 'Dramatische Felsformation, tosendes Meer in der Tiefe, sichere Aussichtsplattform.'
    }
  },
  {
    id: 'loc_stillwater_lake',
    name: 'Stillwassersee',
    landscape: 'Wetter des Erlebens',
    motif: 'Spiegelglatter See mit Steg und Bootshaus',
    landmarkIconType: 'lake_boathouse',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#cfdcd5',
      bgGround: '#6f8f7c',
      focalObjects: ['Spiegelnder Gebirgssee', 'Warm beleuchtetes Bootshaus', 'Holzsteg mit anliegendem Ruderboot', 'Schilfgürtel am Ufer'],
      details: 'Vollkommene Ruhe, leichter Eisrand, einladendes goldenes Licht aus den Fenstern des Bootshauses.'
    }
  },
  {
    id: 'loc_mask_market',
    name: 'Maskenmarkt',
    landscape: 'Wetter des Erlebens',
    motif: 'Marktplatz mit Maskenmacher-Werkstatt',
    landmarkIconType: 'mask_workshop',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e8dcce',
      bgGround: '#b8a695',
      focalObjects: ['Marktstand mit Holzmasken', 'Werkbank mit Schnitzwerkzeug', 'Spiegel mit Vorhang', 'Offene Torbögen zum Marktplatz'],
      details: 'Pflasterstein-Marktplatz, aufgereihte Masken verschiedener Stile, warme Hängelaternen.'
    }
  },

  // B. Bedürfnisse & Ressourcen
  {
    id: 'loc_safety_house',
    name: 'Schutzhaus',
    landscape: 'Bedürfnisse & Ressourcen',
    motif: 'Robustes Natursteinhaus mit Innenhof',
    landmarkIconType: 'sanctuary_house',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e5dbcd',
      bgGround: '#9fa893',
      focalObjects: ['Massives Natursteinhaus mit warmen Fenstern', 'Begrünter geschützter Innenhof', 'Offene Eingangstore', 'Brunnenbecken mit Sitzbank'],
      details: 'Gefühl von Schutz und Geborgenheit, dicke Mauern, weiches Kaminfeuer-Licht.'
    }
  },
  {
    id: 'loc_self_compassion_garden',
    name: 'Garten der Selbstfreundlichkeit',
    landscape: 'Bedürfnisse & Ressourcen',
    motif: 'Moosgarten mit Kintsugi-Keramikgefäßen',
    landmarkIconType: 'kintsugi_garden',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#dce6db',
      bgGround: '#769476',
      focalObjects: ['Blühender Steingarten mit Moospfaden', 'Werkbank für Goldkeramik (Kintsugi)', 'Geflickte Teeschalen mit goldenen Nähten', 'Hölzerne Laube'],
      details: 'Sanfte Natur, unperfekte Schönheit, goldene Reparaturstellen an Tongefäßen.'
    }
  },
  {
    id: 'loc_resource_grove',
    name: 'Ressourcenhain',
    landscape: 'Bedürfnisse & Ressourcen',
    motif: 'Lichter Hain mit Quellbecken und alten Eichen',
    landmarkIconType: 'oak_grove',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#d9e8dc',
      bgGround: '#638a63',
      focalObjects: ['Mächtige alte Eichen mit tiefen Wurzeln', 'Klares Quellbecken aus Naturstein', 'Sonnendurchflutete Lichtung', 'Holztruhe mit Erinnerungsstücken'],
      details: 'Lebendiges Blattwerk, tanzendes Sonnenlicht, spürbare Vitalität und Kraft.'
    }
  },
  {
    id: 'loc_boundary_bridge',
    name: 'Grenzbrücke',
    landscape: 'Bedürfnisse & Ressourcen',
    motif: 'Bewegliche Zugbrücke mit Hebelmechanismus',
    landmarkIconType: 'drawbridge',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#e6ded3',
      bgGround: '#8f7e71',
      focalObjects: ['Holz-Zugbrücke über tiefen Fluss', 'Mechanisches Steuerrad mit Sperrklinke', 'Grenzpfosten mit Glocke', 'Wärterhäuschen'],
      details: 'Klare Grenze, selbstbestimmte Kontrolle über das Öffnen und Schließen der Brücke.'
    }
  },
  {
    id: 'loc_values_observatory',
    name: 'Sternwarte der Werte',
    landscape: 'Bedürfnisse & Ressourcen',
    motif: 'Kleine Kuppel-Sternwarte mit Messinginstrumenten',
    landmarkIconType: 'observatory_dome',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#2b3a4a',
      bgGround: '#5c6b75',
      focalObjects: ['Kuppeldach mit Teleskop-Öffnung', 'Großes Messingteleskop', 'Sternenkarten und Armillarsphäre', 'Offenes Fenster zum Sternenhimmel'],
      details: 'Magische Nachtstimmung, funkelnde Leitsterne, warme Messingreflexionen.'
    }
  },

  // C. Lebensgeschichte & Muster
  {
    id: 'loc_life_archive',
    name: 'Archiv der Lebensspuren',
    landscape: 'Lebensgeschichte & Muster',
    motif: 'Helles Hang-Archiv mit Zeitlinien und Schriftrollen',
    landmarkIconType: 'scroll_archive',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e3dcd1',
      bgGround: '#9e9182',
      focalObjects: ['Hohe Holzregale voller Landkarten und Rollen', 'Großer Lesetisch mit Zeitleisten-Zeichnungen', 'Schubladenschrank mit Jahrgangs-Schildern', 'Oberlicht mit einfallendem Sonnenstrahl'],
      details: 'Gelehrte und ruhige Atmosphäre, ordnende Übersicht über vergangene Lebensetappen.'
    }
  },
  {
    id: 'loc_echo_cave',
    name: 'Echohöhle der Muster',
    landscape: 'Lebensgeschichte & Muster',
    motif: 'Felsenhöhle mit sanftem Nachhall und mehreren Ausgängen',
    landmarkIconType: 'cavern_arches',
    colorAccent: '#5a5043',
    sceneTheme: {
      bgSky: '#c2bcb3',
      bgGround: '#5c544b',
      focalObjects: ['Gewölbte Felshöhle mit Fackelbeleuchtung', 'Schalltrichter aus Kupfer', 'Mehrere begehbare Ausgangstunnel', 'Wasserbecken mit Echo-Wellenringen'],
      details: 'Sichtbare Resonanzwellen, Höhlenöffnungen zum Tageslicht, Auswege aus alten Schleifen.'
    }
  },
  {
    id: 'loc_closeness_distance_passage',
    name: 'Passage von Nähe und Abstand',
    landscape: 'Lebensgeschichte & Muster',
    motif: 'Felsenschlucht mit mehreren Brückenstegen in Distanz',
    landmarkIconType: 'passage_bridges',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#d4dee3',
      bgGround: '#75878f',
      focalObjects: ['Schlucht mit parallelen Hängebrücken', 'Rastplateaus mit variablem Abstand', 'Signallaternen zur Verständigung', 'Felsstufen nach oben'],
      details: 'Visuelle Darstellung von Distanz und Annäherung in Beziehungswegen.'
    }
  },
  {
    id: 'loc_parts_house',
    name: 'Haus der inneren Stimmen',
    landscape: 'Lebensgeschichte & Muster',
    motif: 'Gutshaus mit verschiedenen Themenzimmern um einen Flur',
    landmarkIconType: 'manor_house',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#e8ded4',
      bgGround: '#998a7d',
      focalObjects: ['Zentraler holzgetäfelter Flur', 'Tür zum spielerischen Kinderzimmer', 'Tür zum strengen Bibliothekszimmer', 'Runder Besprechungstisch in der Mitte'],
      details: 'Gleichwertige Türen für unterschiedliche innere Anteile, einladender runder Tisch.'
    }
  },
  {
    id: 'loc_rationale_cartography',
    name: 'Kartenkammer der Erklärungsmodelle',
    landscape: 'Lebensgeschichte & Muster',
    motif: 'Kartensaal mit transparenten Pauspapier-Ebenen',
    landmarkIconType: 'map_table',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#ede6dc',
      bgGround: '#9e9182',
      focalObjects: ['Großer Leuchttisch mit Landschaftskarten', 'Halbtransparente Pergament-Overlays', 'Zirkel, Lupe und Kartografierbesteck', 'Globus mit Schichten'],
      details: 'Mehrere Erklärungsansätze über demselben Gelände übereinandergelegt.'
    }
  },

  // D. Veränderungsprozesse
  {
    id: 'loc_thought_lab',
    name: 'Gedankenlabor',
    landscape: 'Veränderungsprozesse',
    motif: 'Helle Werkstatt mit Waagen, Prismen und Perspektivrahmen',
    landmarkIconType: 'scales_prism',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e5e1d5',
      bgGround: '#8c947c',
      focalObjects: ['Präzisions-Balkenwaage aus Messing', 'Verschiebbare Rahmen für Perspektiven', 'Optisches Prisma mit Farbspektrum', 'Gedankenprotokoll-Notizbuch'],
      details: 'Neugieriges wissenschaftliches Prüfen von Annahmen, klare Lichteinfälle.'
    }
  },
  {
    id: 'loc_emotion_studio',
    name: 'Gefühlsatelier',
    landscape: 'Veränderungsprozesse',
    motif: 'Lichtdurchflutetes Künstleratelier mit Farben und Feuer',
    landmarkIconType: 'artist_palette',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#ebdccc',
      bgGround: '#8a6e5b',
      focalObjects: ['Große Staffelei mit lebendigen Farbfeldern', 'Gefäße mit Naturpigmenten', 'Eingefasste offene Kamin-Feuerstelle', 'Formbare Ton-Skulpturen'],
      details: 'Kreativer Ausdruck, feurige und sanfte Elemente harmonisch vereint.'
    }
  },
  {
    id: 'loc_body_observatory',
    name: 'Körperobservatorium',
    landscape: 'Veränderungsprozesse',
    motif: 'Stiller Raum mit Pendeln und Bewegungsebenen',
    landmarkIconType: 'pendulum_room',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#dfe8e1',
      bgGround: '#738a79',
      focalObjects: ['Hölzernes Balance- und Schwingpendel', 'Körperumriss-Tafel mit Atmungsanzeige', 'Mattenfläche aus Naturfasern', 'Panoramafenster in den Garten'],
      details: 'Atem, Haltung, Körpersignale ohne Vorurteil wahrnehmen.'
    }
  },
  {
    id: 'loc_courage_trail',
    name: 'Mutpfad',
    landscape: 'Veränderungsprozesse',
    motif: 'Gesicherter Serpentinenpfad mit Raststufen',
    landmarkIconType: 'winding_trail',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#e3dcd1',
      bgGround: '#8c7765',
      focalObjects: ['Serpentinenweg den Berghang hinauf', 'Hölzerne Zwischenetappen-Balkone', 'Stabiles Sicherungsseil am Fels', 'Jederzeit frei begehbarer Rückweg'],
      details: 'Schrittweises Annähern an Herausforderungen in eigener Dosierung.'
    }
  },
  {
    id: 'loc_mindfulness_pavilion',
    name: 'Achtsamkeitspavillon',
    landscape: 'Veränderungsprozesse',
    motif: 'Offener Pavillon am Wasserlauf mit Klangstäben',
    landmarkIconType: 'zen_pavilion',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#d6e2e8',
      bgGround: '#6a8494',
      focalObjects: ['Freistehender Holzpavillon ohne Wände', 'Plätschernder Kieselstein-Bachlauf', 'Schwebende Wind- und Klangspiele', 'Sitzkissen mit Blick auf den Horizont'],
      details: 'Gegenwärtigkeit, fließendes Wasser, offener Raum zum Bemerken ohne Festhalten.'
    }
  },

  // E. Beziehung & Kontext
  {
    id: 'loc_alliance_bridge',
    name: 'Bündnisbrücke',
    landscape: 'Beziehung & Kontext',
    motif: 'Gemeinsam gebaute Stein-Holz-Bogenbrücke',
    landmarkIconType: 'alliance_arch',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e3dcce',
      bgGround: '#8c806f',
      focalObjects: ['Breite Bogenbrücke aus Feldstein und Eichenbalken', 'Gemeinsamer Rastpavillon auf Brückenmitte', 'Zwei gleichwertige Einstiegsrampen', 'Flussströmung unter den Bögen'],
      details: 'Kooperation, gleichberechtigte Zusammenarbeit auf Augenhöhe.'
    }
  },
  {
    id: 'loc_repair_dock',
    name: 'Reparaturdock',
    landscape: 'Beziehung & Kontext',
    motif: 'Bootswerft an einer Bucht für Reparaturen',
    landmarkIconType: 'shipyard_dock',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#d4dfdf',
      bgGround: '#6c8585',
      focalObjects: ['Trockendock mit aufgebocktem Holzboot', 'Werkzeuge zum Abdichten von Fugen', 'Geschützte Bucht mit Wellenbrecher', 'Leuchtsignal am Dockende'],
      details: 'Sorgsames Reparieren von Rissen und Brüchen in der Beziehung.'
    }
  },
  {
    id: 'loc_perspective_square',
    name: 'Platz der Perspektiven',
    landscape: 'Beziehung & Kontext',
    motif: 'Runder Platz mit Aussichtsbalkonen und Spiegeln',
    landmarkIconType: 'mirrors_square',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#e0e5da',
      bgGround: '#7a8c75',
      focalObjects: ['Runder Pflasterplatz mit schattigen Platanen', 'Zwei gegenüberliegende erhöhte Holzbalkone', 'Spiegelnde Wasserflächen', 'Sichtachsen durch Torbögen'],
      details: 'Gleiche Situation aus unterschiedlichen Blickwinkeln betrachten.'
    }
  },
  {
    id: 'loc_network_courtyard',
    name: 'Netzwerkhof',
    landscape: 'Beziehung & Kontext',
    motif: 'Fachwerkhof mit Verbindungswegen und Tischen',
    landmarkIconType: 'village_courtyard',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#e6dfd5',
      bgGround: '#8f7d6e',
      focalObjects: ['Gemeinsamer Innenhof zwischen Fachwerkhäusern', 'Großer runder Holztisch im Zentrum', 'Sichtbare Wege und Rankseile zwischen Gebäuden', 'Tafel mit Stammbaum-Skizze'],
      details: 'Familie, Arbeit und soziale Rollen im Wechselspiel.'
    }
  },
  {
    id: 'loc_group_campfire',
    name: 'Gruppenfeuer',
    landscape: 'Beziehung & Kontext',
    motif: 'Geschützter Wald-Rastplatz mit Lagerfeuer',
    landmarkIconType: 'forest_campfire',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#3b3228',
      bgGround: '#544638',
      focalObjects: ['Sicher eingefasste Lagerfeuerstelle', 'Kreisförmig angeordnete Holzstämme und Bänke', 'Schützendes Blätterdach alter Buchen', 'Breiter, freier Ausstiegspfad'],
      details: 'Wärmende Gemeinschaft, Resonanz, geteilte Erfahrung ohne Zwang.'
    }
  },

  // F. Orientierung & Sicherheit
  {
    id: 'loc_methods_library',
    name: 'Bibliothek der Verfahren',
    landscape: 'Orientierung & Sicherheit',
    motif: 'Klassische helle Bibliothek mit Werkzeugtischen',
    landmarkIconType: 'library_hall',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#e8e2d8',
      bgGround: '#9e9182',
      focalObjects: ['Große Lesegalerie mit Buchregalen', 'Übersichtstafeln zu Therapieverfahren', 'Gemeinsamer Werkzeugtisch mit Methoden-Karten', 'Große Bogenfenster zum Garten'],
      details: 'Wissenschaftliche Taxonomie und schulenübergreifende Werkzeuge übersichtlich geordnet.'
    }
  },
  {
    id: 'loc_goal_foundry',
    name: 'Zielschmiede',
    landscape: 'Orientierung & Sicherheit',
    motif: 'Lichtdurchflutete Schmiede mit anpassbaren Werkstücken',
    landmarkIconType: 'anvil_foundry',
    colorAccent: '#c68a35',
    sceneTheme: {
      bgSky: '#ebe0d1',
      bgGround: '#87705f',
      focalObjects: ['Schmiedefeuer und großer Amboss', 'Flexibel formbare Messing- und Kupferformen', 'Zeichentisch mit Entwurfsskizzen', 'Werkzeughalter an der Wand'],
      details: 'Therapieziele gemeinsam erarbeiten und im Verlauf flexibel nachjustieren.'
    }
  },
  {
    id: 'loc_progress_observatory',
    name: 'Verlaufswarte',
    landscape: 'Orientierung & Sicherheit',
    motif: 'Beobachtungsturm mit Panoramablick und Reisetagebuch',
    landmarkIconType: 'survey_tower',
    colorAccent: '#446473',
    sceneTheme: {
      bgSky: '#dce5eb',
      bgGround: '#6a7d8c',
      focalObjects: ['Steinerner Aussichtsturm mit hölzernem Umlauf', 'Großes aufgeschlagenes Reisetagebuch', 'Höhenmesser und Wegmarkierungs-Karten', 'Fernrohr auf das Umland'],
      details: 'Entwicklungsschritte und Kurskorrekturen im Therapieverlauf dokumentieren.'
    }
  },
  {
    id: 'loc_second_opinion_house',
    name: 'Haus der zweiten Meinung',
    landscape: 'Orientierung & Sicherheit',
    motif: 'Offenes Beratungshaus an einer markanten Weggabelung',
    landmarkIconType: 'crossroads_pavilion',
    colorAccent: '#50755a',
    sceneTheme: {
      bgSky: '#e2e7df',
      bgGround: '#7f917d',
      focalObjects: ['Helles Beratungshaus mit Rundbogenfenstern', 'Gabelung zweier gleichwertiger Wege', 'Infotafel zu Patientenrechten', 'Freies Ausgangstor'],
      details: 'Selbstbestimmung, Patientenrechte und Klärung von Wechselmöglichkeiten.'
    }
  },
  {
    id: 'loc_crisis_watch',
    name: 'Krisenwache',
    landscape: 'Orientierung & Sicherheit',
    motif: 'Rund um die Uhr beleuchtete Wache nahe dem Bahnhof',
    landmarkIconType: 'watch_station',
    colorAccent: '#b25838',
    sceneTheme: {
      bgSky: '#2f3542',
      bgGround: '#57606f',
      focalObjects: ['Massive, warm erleuchtete Wachstation', 'Immer geöffnetes Eingangstor mit Laterne', 'Ruheraum mit Kamin und Decken', 'Direkte Notruf-Fernsprecher-Säule'],
      details: '24/7 Notfallanlaufstelle, Sicherheit, sofortige Entlastung und professionelle Hilfe.'
    }
  }
];

function generateLandmarkSvg(loc: LocationAssetDef): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#2d261e" flood-opacity="0.35"/>
    </filter>
    <linearGradient id="grad-${loc.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${loc.colorAccent}"/>
      <stop offset="100%" stop-color="#2d261e"/>
    </linearGradient>
  </defs>
  <g filter="url(#shadow)">
    <!-- Base Circular Shield Badge -->
    <circle cx="256" cy="256" r="220" fill="#f6f1e8" stroke="${loc.colorAccent}" stroke-width="12"/>
    <circle cx="256" cy="256" r="200" fill="none" stroke="#ede4d3" stroke-width="4" stroke-dasharray="8 6"/>

    <!-- Distinct Silhouette Icons -->
    ${getLandmarkIconPath(loc.landmarkIconType, loc.colorAccent)}

    <!-- Outer Decorative Compass Nodule -->
    <circle cx="256" cy="46" r="10" fill="${loc.colorAccent}"/>
    <circle cx="256" cy="466" r="10" fill="${loc.colorAccent}"/>
    <circle cx="46" cy="256" r="10" fill="${loc.colorAccent}"/>
    <circle cx="466" cy="256" r="10" fill="${loc.colorAccent}"/>
  </g>
</svg>`;
}

function getLandmarkIconPath(type: string, accent: string): string {
  switch (type) {
    case 'windmill':
      return `
        <!-- Windmill -->
        <polygon points="216,400 296,400 276,220 236,220" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
        <path d="M226,220 Q256,180 286,220" fill="#c68a35" stroke="#2d261e" stroke-width="6"/>
        <circle cx="256" cy="210" r="18" fill="#2d261e"/>
        <!-- Blades -->
        <line x1="256" y1="210" x2="150" y2="110" stroke="#2d261e" stroke-width="10" stroke-linecap="round"/>
        <line x1="256" y1="210" x2="362" y2="110" stroke="#2d261e" stroke-width="10" stroke-linecap="round"/>
        <line x1="256" y1="210" x2="362" y2="310" stroke="#2d261e" stroke-width="10" stroke-linecap="round"/>
        <line x1="256" y1="210" x2="150" y2="310" stroke="#2d261e" stroke-width="10" stroke-linecap="round"/>
        <rect x="130" y="90" width="40" height="40" fill="#f6f1e8" stroke="${accent}" stroke-width="4"/>
        <rect x="342" y="90" width="40" height="40" fill="#f6f1e8" stroke="${accent}" stroke-width="4"/>
        <rect x="342" y="290" width="40" height="40" fill="#f6f1e8" stroke="${accent}" stroke-width="4"/>
        <rect x="130" y="290" width="40" height="40" fill="#f6f1e8" stroke="${accent}" stroke-width="4"/>
      `;
    case 'marsh_lantern':
      return `
        <!-- Marsh and Lantern -->
        <path d="M120,380 Q256,410 392,380 L392,410 Q256,430 120,410 Z" fill="#6b7d7f"/>
        <line x1="160" y1="380" x2="160" y2="300" stroke="#2d261e" stroke-width="8"/>
        <line x1="256" y1="390" x2="256" y2="200" stroke="#2d261e" stroke-width="12"/>
        <line x1="352" y1="380" x2="352" y2="320" stroke="#2d261e" stroke-width="8"/>
        <!-- Lantern head -->
        <polygon points="230,200 282,200 292,150 220,150" fill="#c68a35" stroke="#2d261e" stroke-width="8"/>
        <rect x="236" y="150" width="40" height="40" fill="#fffdf8" stroke="#2d261e" stroke-width="6"/>
        <circle cx="256" cy="170" r="10" fill="#c68a35"/>
        <path d="M210,150 Q256,120 302,150" fill="#2d261e"/>
      `;
    case 'cliffs_station':
      return `
        <!-- Cliffs and Station -->
        <polygon points="120,420 220,260 290,320 392,420" fill="#8a796e" stroke="#2d261e" stroke-width="8"/>
        <rect x="220" y="220" width="70" height="50" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
        <polygon points="210,220 255,180 300,220" fill="#b25838" stroke="#2d261e" stroke-width="6"/>
        <line x1="255" y1="180" x2="255" y2="120" stroke="#2d261e" stroke-width="6"/>
        <polygon points="255,120 295,135 255,150" fill="#b25838"/>
      `;
    case 'lake_boathouse':
      return `
        <!-- Lake & Boathouse -->
        <ellipse cx="256" cy="360" rx="140" ry="40" fill="#50755a" opacity="0.6"/>
        <rect x="210" y="220" width="92" height="90" fill="#fffdf8" stroke="#2d261e" stroke-width="8"/>
        <polygon points="190,220 256,160 322,220" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
        <rect x="240" y="260" width="32" height="50" fill="#2d261e"/>
        <line x1="160" y1="360" x2="240" y2="310" stroke="#2d261e" stroke-width="8"/>
      `;
    case 'sanctuary_house':
      return `
        <!-- Sanctuary House -->
        <rect x="180" y="220" width="152" height="160" fill="#f6f1e8" stroke="#2d261e" stroke-width="10"/>
        <polygon points="160,220 256,130 352,220" fill="${accent}" stroke="#2d261e" stroke-width="10"/>
        <path d="M236,380 L236,300 Q256,280 276,300 L276,380 Z" fill="${accent}" stroke="#2d261e" stroke-width="6"/>
        <circle cx="256" cy="200" r="16" fill="#c68a35"/>
      `;
    case 'observatory_dome':
      return `
        <!-- Observatory Dome -->
        <rect x="196" y="260" width="120" height="120" fill="#f6f1e8" stroke="#2d261e" stroke-width="10"/>
        <path d="M196,260 A60,60 0 0,1 316,260 Z" fill="${accent}" stroke="#2d261e" stroke-width="10"/>
        <line x1="240" y1="240" x2="340" y2="150" stroke="#c68a35" stroke-width="16" stroke-linecap="round"/>
        <line x1="240" y1="240" x2="340" y2="150" stroke="#2d261e" stroke-width="6" stroke-linecap="round"/>
        <circle cx="345" cy="145" r="10" fill="#c68a35"/>
      `;
    case 'drawbridge':
      return `
        <!-- Drawbridge -->
        <rect x="160" y="200" width="40" height="180" fill="#2d261e"/>
        <rect x="312" y="200" width="40" height="180" fill="#2d261e"/>
        <line x1="160" y1="360" x2="330" y2="280" stroke="${accent}" stroke-width="16"/>
        <line x1="180" y1="210" x2="330" y2="280" stroke="#2d261e" stroke-width="4" stroke-dasharray="6 4"/>
      `;
    case 'scroll_archive':
      return `
        <!-- Scroll Archive -->
        <rect x="176" y="200" width="160" height="170" fill="#f6f1e8" stroke="#2d261e" stroke-width="10"/>
        <line x1="176" y1="260" x2="336" y2="260" stroke="#2d261e" stroke-width="6"/>
        <line x1="176" y1="320" x2="336" y2="320" stroke="#2d261e" stroke-width="6"/>
        <!-- Scrolls -->
        <ellipse cx="216" cy="230" rx="20" ry="12" fill="${accent}"/>
        <ellipse cx="296" cy="230" rx="20" ry="12" fill="${accent}"/>
        <ellipse cx="256" cy="290" rx="24" ry="14" fill="#b25838"/>
        <polygon points="156,200 256,130 356,200" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
      `;
    case 'scales_prism':
      return `
        <!-- Scales and Prism -->
        <line x1="256" y1="160" x2="256" y2="380" stroke="#2d261e" stroke-width="10"/>
        <line x1="170" y1="200" x2="342" y2="200" stroke="#2d261e" stroke-width="8"/>
        <!-- Left Pan -->
        <line x1="170" y1="200" x2="150" y2="270" stroke="#2d261e" stroke-width="4"/>
        <line x1="170" y1="200" x2="190" y2="270" stroke="#2d261e" stroke-width="4"/>
        <path d="M140,270 Q170,290 200,270 Z" fill="${accent}" stroke="#2d261e" stroke-width="6"/>
        <!-- Right Pan -->
        <line x1="342" y1="200" x2="322" y2="270" stroke="#2d261e" stroke-width="4"/>
        <line x1="342" y1="200" x2="362" y2="270" stroke="#2d261e" stroke-width="4"/>
        <path d="M312,270 Q342,290 372,270 Z" fill="${accent}" stroke="#2d261e" stroke-width="6"/>
        <polygon points="256,340 230,380 282,380" fill="#2d261e"/>
      `;
    case 'alliance_arch':
      return `
        <!-- Alliance Arch Bridge -->
        <path d="M140,360 Q256,210 372,360 L352,380 Q256,260 160,380 Z" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
        <rect x="236" y="210" width="40" height="50" fill="#f6f1e8" stroke="#2d261e" stroke-width="6"/>
        <polygon points="226,210 256,170 286,210" fill="#b25838" stroke="#2d261e" stroke-width="6"/>
        <circle cx="256" cy="240" r="8" fill="#c68a35"/>
      `;
    case 'watch_station':
      return `
        <!-- Crisis Watch Station -->
        <rect x="180" y="190" width="152" height="190" fill="#2d261e" stroke="#b25838" stroke-width="10"/>
        <polygon points="160,190 256,110 352,190" fill="#b25838" stroke="#2d261e" stroke-width="8"/>
        <circle cx="256" cy="250" r="28" fill="#c68a35" stroke="#f6f1e8" stroke-width="6"/>
        <!-- Cross / SOS Shield -->
        <rect x="250" y="235" width="12" height="30" fill="#f6f1e8"/>
        <rect x="241" y="244" width="30" height="12" fill="#f6f1e8"/>
        <rect x="236" y="320" width="40" height="60" fill="#c68a35"/>
      `;
    default:
      return `
        <!-- Default Classic Landmark Shield -->
        <rect x="186" y="210" width="140" height="150" fill="#f6f1e8" stroke="#2d261e" stroke-width="8"/>
        <polygon points="166,210 256,140 346,210" fill="${accent}" stroke="#2d261e" stroke-width="8"/>
        <circle cx="256" cy="280" r="28" fill="${accent}"/>
      `;
  }
}

function generateSceneSvg(loc: LocationAssetDef): string {
  const f = loc.sceneTheme;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
  <defs>
    <linearGradient id="sky-${loc.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${f.bgSky}"/>
      <stop offset="100%" stop-color="#f6f1e8"/>
    </linearGradient>
    <linearGradient id="ground-${loc.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f6f1e8"/>
      <stop offset="100%" stop-color="${f.bgGround}"/>
    </linearGradient>
  </defs>

  <!-- Sky Background -->
  <rect x="0" y="0" width="960" height="300" fill="url(#sky-${loc.id})"/>

  <!-- Distant Mountains/Hills & Horizon -->
  <path d="M0,260 Q240,190 480,240 T960,220 L960,320 L0,320 Z" fill="#b5c0b8" opacity="0.6"/>
  <path d="M0,290 Q300,240 600,280 T960,270 L960,540 L0,540 Z" fill="url(#ground-${loc.id})"/>

  <!-- Foreground Landscape & Paths -->
  <path d="M120,540 Q380,420 540,330 T680,290" fill="none" stroke="#e0d3be" stroke-width="32" stroke-linecap="round"/>
  <path d="M120,540 Q380,420 540,330 T680,290" fill="none" stroke="#c4b297" stroke-width="24" stroke-dasharray="16 8"/>

  <!-- Main Focal Architectural & Environmental Scene Group -->
  <g id="focal-group" transform="translate(320, 160)">
    <!-- Central Main Structure -->
    <rect x="40" y="60" width="240" height="180" fill="#f6f1e8" stroke="#2d261e" stroke-width="6" rx="4"/>
    <polygon points="10,60 160,-20 310,60" fill="${loc.colorAccent}" stroke="#2d261e" stroke-width="6"/>
    
    <!-- Doors & Windows with Warm Light -->
    <rect x="130" y="140" width="60" height="100" fill="#2d261e" rx="2"/>
    <rect x="140" y="150" width="40" height="90" fill="#c68a35" opacity="0.85"/>
    <rect x="65" y="90" width="45" height="45" fill="#fffdf8" stroke="#2d261e" stroke-width="4"/>
    <rect x="210" y="90" width="45" height="45" fill="#fffdf8" stroke="#2d261e" stroke-width="4"/>

    <!-- Focal Details -->
    <circle cx="160" cy="20" r="18" fill="#c68a35" stroke="#2d261e" stroke-width="4"/>
  </g>

  <!-- Left Focal Point / Secondary Feature -->
  <g transform="translate(100, 260)">
    <circle cx="50" cy="50" r="45" fill="#50755a" opacity="0.8"/>
    <rect x="44" y="80" width="12" height="70" fill="#5a5043"/>
    <path d="M10,120 Q60,100 110,120" fill="none" stroke="#5a5043" stroke-width="6"/>
    <!-- Bench / Marker -->
    <rect x="20" y="130" width="60" height="16" fill="#c68a35" stroke="#2d261e" stroke-width="3"/>
  </g>

  <!-- Right Focal Point / Environment Details -->
  <g transform="translate(720, 240)">
    <!-- Lantern Post -->
    <line x1="60" y1="200" x2="60" y2="60" stroke="#2d261e" stroke-width="6"/>
    <polygon points="45,60 75,60 80,30 40,30" fill="#c68a35" stroke="#2d261e" stroke-width="4"/>
    <circle cx="60" cy="45" r="12" fill="#fffdf8" stroke="#c68a35" stroke-width="3"/>
    <!-- Signpost -->
    <rect x="60" y="90" width="80" height="24" fill="#ede4d3" stroke="#2d261e" stroke-width="3"/>
    <text x="70" y="106" font-family="sans-serif" font-size="10" fill="#2d261e" font-weight="bold">WEGWEISER</text>
  </g>

  <!-- Draft Concept Banner Overlay -->
  <rect x="20" y="20" width="340" height="44" fill="#2d261e" opacity="0.8" rx="6"/>
  <text x="35" y="46" font-family="'Georgia', serif" font-size="16" fill="#f6f1e8" font-weight="bold">${loc.name}</text>
  <rect x="20" y="476" width="380" height="44" fill="#f6f1e8" opacity="0.9" rx="4" stroke="#c68a35" stroke-width="2"/>
  <text x="35" y="502" font-family="sans-serif" font-size="12" fill="#5a5043">Konzept-Entwurf • ${loc.landscape}</text>
</svg>`;
}

async function main() {
  const baseDir = path.resolve(process.cwd(), 'public/assets/prototypes/inner-atlas-v01');
  const landmarksDir = path.join(baseDir, 'landmarks');
  const scenesDir = path.join(baseDir, 'scenes');
  const contactDir = path.join(baseDir, 'contact_sheets');

  console.log('Erzeuge 30 Landmark-Assets und 30 Szenen-Konzeptbilder...');

  const manifestEntries: Array<{
    filename: string;
    locationId: string;
    type: string;
    dimensions: string;
    prompt: string;
    tool: string;
    date: string;
    sha256: string;
    status: string;
  }> = [];

  for (const loc of LOCATIONS) {
    // 1. Landmark SVG
    const landmarkSvg = generateLandmarkSvg(loc);
    const landmarkFile = `${loc.id}.svg`;
    const landmarkPath = path.join(landmarksDir, landmarkFile);
    fs.writeFileSync(landmarkPath, landmarkSvg, 'utf-8');

    const landmarkHash = crypto.createHash('sha256').update(landmarkSvg).digest('hex');
    manifestEntries.push({
      filename: `landmarks/${landmarkFile}`,
      locationId: loc.id,
      type: 'Landmark-Silhouette (SVG)',
      dimensions: '512x512',
      prompt: `Vector linocut landmark badge for ${loc.name} (${loc.motif}) with color ${loc.colorAccent}`,
      tool: 'Vector-SVG Generator (Prototype Pipeline)',
      date: '2026-09-03',
      sha256: landmarkHash,
      status: 'concept-draft'
    });

    // 2. Scene Concept SVG
    const sceneSvg = generateSceneSvg(loc);
    const sceneFile = `${loc.id}.svg`;
    const scenePath = path.join(scenesDir, sceneFile);
    fs.writeFileSync(scenePath, sceneSvg, 'utf-8');

    const sceneHash = crypto.createHash('sha256').update(sceneSvg).digest('hex');
    manifestEntries.push({
      filename: `scenes/${sceneFile}`,
      locationId: loc.id,
      type: 'Szenen-Konzeptbild (SVG)',
      dimensions: '960x540 (16:9)',
      prompt: `Point-and-click concept scene for ${loc.name}: ${loc.motif}. Focal points: ${loc.sceneTheme.focalObjects.join(', ')}`,
      tool: 'Vector-SVG Generator (Prototype Pipeline)',
      date: '2026-09-03',
      sha256: sceneHash,
      status: 'concept-draft'
    });
  }

  // 3. Generate Contact Sheet HTML / SVG
  const landmarkContactSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" width="1600" height="1200">
    <rect width="1600" height="1200" fill="#f6f1e8"/>
    <text x="50" y="60" font-family="'Georgia', serif" font-size="32" fill="#2d261e" font-weight="bold">Kontaktübersicht: 30 Landmark-Silhouetten (Innerer Atlas V0.1)</text>
    <text x="50" y="90" font-family="sans-serif" font-size="16" fill="#5a5043">Alle 30 neuen Schauplätze • Transparente Vektor-Silhouetten</text>
    ${LOCATIONS.map((loc, idx) => {
      const col = idx % 6;
      const row = Math.floor(idx / 6);
      const x = 50 + col * 250;
      const y = 120 + row * 210;
      return `<g transform="translate(${x}, ${y})">
        <rect width="230" height="190" fill="#ede4d3" rx="8" stroke="#c68a35" stroke-width="1"/>
        <g transform="translate(45, 10) scale(0.27)">
          ${getLandmarkIconPath(loc.landmarkIconType, loc.colorAccent)}
        </g>
        <text x="115" y="165" font-family="sans-serif" font-size="11" fill="#2d261e" font-weight="bold" text-anchor="middle">${loc.name}</text>
        <text x="115" y="180" font-family="sans-serif" font-size="9" fill="#877a6a" text-anchor="middle">${loc.landscape}</text>
      </g>`;
    }).join('')}
  </svg>`;
  fs.writeFileSync(path.join(contactDir, 'landmarks_contact_sheet.svg'), landmarkContactSvg, 'utf-8');

  const sceneContactSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1350" width="1600" height="1350">
    <rect width="1600" height="1350" fill="#2d261e"/>
    <text x="50" y="60" font-family="'Georgia', serif" font-size="32" fill="#f6f1e8" font-weight="bold">Kontaktübersicht: 30 Szenen-Konzeptbilder (Innerer Atlas V0.1)</text>
    <text x="50" y="90" font-family="sans-serif" font-size="16" fill="#ede4d3">16:9 Point-and-Click Entwürfe mit 4–6 visuellen Fokuspunkten</text>
    ${LOCATIONS.map((loc, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      const x = 50 + col * 300;
      const y = 120 + row * 200;
      return `<g transform="translate(${x}, ${y})">
        <rect width="280" height="175" fill="#f6f1e8" rx="6" stroke="#c68a35" stroke-width="2"/>
        <g transform="translate(10, 10) scale(0.27)">
          <rect width="960" height="540" fill="${loc.sceneTheme.bgSky}"/>
          <path d="M0,280 Q480,220 960,260 L960,540 L0,540 Z" fill="${loc.sceneTheme.bgGround}"/>
          <rect x="360" y="180" width="240" height="180" fill="#f6f1e8" stroke="#2d261e" stroke-width="12"/>
          <polygon points="320,180 480,80 640,180" fill="${loc.colorAccent}"/>
        </g>
        <text x="140" y="165" font-family="sans-serif" font-size="10" fill="#2d261e" font-weight="bold" text-anchor="middle">${loc.name}</text>
      </g>`;
    }).join('')}
  </svg>`;
  fs.writeFileSync(path.join(contactDir, 'scenes_contact_sheet.svg'), sceneContactSvg, 'utf-8');

  // 4. Write Asset Manifest MD
  let manifestMd = `# Asset-Manifest: Innerer Psychotherapie-Atlas V0.1

**Status:** Konzeptentwurf (concept-draft)  
**Erstellungsdatum:** 03. September 2026  
**Zielverzeichnis:** \`public/assets/prototypes/inner-atlas-v01/\`

| Dateiname | Ort-ID | Bildtyp | Abmessungen | Erstellungswerkzeug / Prompt | SHA-256 | Status |
|---|---|---|---|---|---|---|
`;

  for (const entry of manifestEntries) {
    manifestMd += `| \`${entry.filename}\` | \`${entry.locationId}\` | ${entry.type} | ${entry.dimensions} | ${entry.prompt} (${entry.tool}) | \`${entry.sha256}\` | \`${entry.status}\` |\n`;
  }

  const manifestPath = path.resolve(process.cwd(), 'docs/ASSET_MANIFEST_INNER_ATLAS_V01.md');
  fs.writeFileSync(manifestPath, manifestMd, 'utf-8');

  console.log(`Erfolg: 60 Assets und Manifest mit ${manifestEntries.length} Einträgen erstellt.`);
}

main().catch(console.error);
