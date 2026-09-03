# Innerer Psychotherapie-Atlas V0.1: Navigation & Topologie

**Status:** Konzeptentwurf (concept-draft)  
**Branch:** `prototype/inner-atlas-v01`  
**Zweck:** Topologische Definition des Wegenetzes, der Koordinaten, Kanten und Routen-Overlays für die 37 Landmarken der vollständigen inneren Landkarte.

---

## 1. Räumliche Anordnung & Entwurfsbegründung

Die 37 Landmarken sind in sechs miteinander verwobene Landschaftsräume eingebettet:
* **Zentraler Orientierungsanker:** Der *Leuchtturm der Evidenz* (`loc_lighthouse`) liegt im Herzen der Karte und verbindet die Erkenntnisräume miteinander.
* **Südlicher Versorgungseingang:** Der *Bahnhof der Versorgung* (`loc_station`) und die *Krisenwache* (`loc_crisis_watch`) bilden die Schwelle von der Außenwelt in die innere Landschaft.
* **Fließende Übergänge statt Territorien:** Keine harten Grenzen zwischen Therapieschulen. Schulenspezifische Teaser-Orte liegen eingebettet in thematische Landschaften (z. B. KVT bei Veränderungsprozessen, Systemik bei Beziehung & Kontext).
* **Organische Wegenetze:** Ein äußerer Ringweg, drei landschaftsübergreifende Brücken, radiale Pfade zum Leuchtturm und Querverbindungen zwischen benachbarten Schauplätzen verhindern Sackgassen und vermitteln nichtlineare Erkundungsmöglichkeiten.

---

## 2. Koordinatenmatrix der 37 Landmarken

| ID | Name | Landschaft | xPercent | yPercent | Typ |
|---|---|---|---|---|---|
| **Bestehende Anker & Teaser** | | | | | |
| `loc_lighthouse` | Leuchtturm der Evidenz | Orientierung & Sicherheit | 50.0 | 48.0 | Szene (aktiv) |
| `loc_station` | Bahnhof der Versorgung | Orientierung & Sicherheit | 50.0 | 90.0 | Szene (aktiv) |
| `loc_workshop` | Werkstatt der Erprobung | Veränderungsprozesse | 70.0 | 46.0 | Szene (aktiv) |
| `loc_teaser_cbt` | Plateau der KVT | Veränderungsprozesse | 88.0 | 30.0 | Teaser |
| `loc_teaser_psychoanalysis` | Schlucht der Tiefenpsychologie | Lebensgeschichte & Muster | 20.0 | 18.0 | Teaser |
| `loc_teaser_systemic` | Lichtung der Systemischen Therapie | Beziehung & Kontext | 14.0 | 72.0 | Teaser |
| `loc_teaser_humanistic` | Garten der Humanistischen Verfahren | Beziehung & Kontext | 22.0 | 58.0 | Teaser |
| **A. Wetter des Erlebens** | | | | | |
| `loc_thought_windmill` | Windmühle der Gedanken | Wetter des Erlebens | 62.0 | 22.0 | Neuer Ort |
| `loc_fog_marsh` | Nebelmoor der Erschöpfung | Wetter des Erlebens | 48.0 | 16.0 | Neuer Ort |
| `loc_alarm_cliffs` | Alarmklippen | Wetter des Erlebens | 76.0 | 14.0 | Neuer Ort |
| `loc_stillwater_lake` | Stillwassersee | Wetter des Erlebens | 34.0 | 20.0 | Neuer Ort |
| `loc_mask_market` | Maskenmarkt | Wetter des Erlebens | 38.0 | 32.0 | Neuer Ort |
| **B. Bedürfnisse & Ressourcen** | | | | | |
| `loc_safety_house` | Schutzhaus | Bedürfnisse & Ressourcen | 32.0 | 46.0 | Neuer Ort |
| `loc_self_compassion_garden` | Garten der Selbstfreundlichkeit | Bedürfnisse & Ressourcen | 38.0 | 40.0 | Neuer Ort |
| `loc_resource_grove` | Ressourcenhain | Bedürfnisse & Ressourcen | 40.0 | 56.0 | Neuer Ort |
| `loc_boundary_bridge` | Grenzbrücke | Bedürfnisse & Ressourcen | 26.0 | 66.0 | Neuer Ort |
| `loc_values_observatory` | Sternwarte der Werte | Bedürfnisse & Ressourcen | 44.0 | 36.0 | Neuer Ort |
| **C. Lebensgeschichte & Muster** | | | | | |
| `loc_life_archive` | Archiv der Lebensspuren | Lebensgeschichte & Muster | 24.0 | 26.0 | Neuer Ort |
| `loc_echo_cave` | Echohöhle der Muster | Lebensgeschichte & Muster | 16.0 | 30.0 | Neuer Ort |
| `loc_closeness_distance_passage` | Passage von Nähe und Abstand | Lebensgeschichte & Muster | 18.0 | 44.0 | Neuer Ort |
| `loc_parts_house` | Haus der inneren Stimmen | Lebensgeschichte & Muster | 28.0 | 36.0 | Neuer Ort |
| `loc_rationale_cartography` | Kartenkammer der Erklärungsmodelle | Lebensgeschichte & Muster | 32.0 | 12.0 | Neuer Ort |
| **D. Veränderungsprozesse** | | | | | |
| `loc_thought_lab` | Gedankenlabor | Veränderungsprozesse | 66.0 | 34.0 | Neuer Ort |
| `loc_emotion_studio` | Gefühlsatelier | Veränderungsprozesse | 78.0 | 56.0 | Neuer Ort |
| `loc_body_observatory` | Körperobservatorium | Veränderungsprozesse | 82.0 | 44.0 | Neuer Ort |
| `loc_courage_trail` | Mutpfad | Veränderungsprozesse | 84.0 | 22.0 | Neuer Ort |
| `loc_mindfulness_pavilion` | Achtsamkeitspavillon | Veränderungsprozesse | 58.0 | 36.0 | Neuer Ort |
| **E. Beziehung & Kontext** | | | | | |
| `loc_alliance_bridge` | Bündnisbrücke | Beziehung & Kontext | 34.0 | 68.0 | Neuer Ort |
| `loc_repair_dock` | Reparaturdock | Beziehung & Kontext | 24.0 | 78.0 | Neuer Ort |
| `loc_perspective_square` | Platz der Perspektiven | Beziehung & Kontext | 28.0 | 54.0 | Neuer Ort |
| `loc_network_courtyard` | Netzwerkhof | Beziehung & Kontext | 18.0 | 80.0 | Neuer Ort |
| `loc_group_campfire` | Gruppenfeuer | Beziehung & Kontext | 36.0 | 84.0 | Neuer Ort |
| **F. Orientierung & Sicherheit** | | | | | |
| `loc_methods_library` | Bibliothek der Verfahren | Orientierung & Sicherheit | 44.0 | 78.0 | Neuer Ort |
| `loc_goal_foundry` | Zielschmiede | Orientierung & Sicherheit | 60.0 | 62.0 | Neuer Ort |
| `loc_progress_observatory` | Verlaufswarte | Orientierung & Sicherheit | 72.0 | 74.0 | Neuer Ort |
| `loc_second_opinion_house` | Haus der zweiten Meinung | Orientierung & Sicherheit | 58.0 | 82.0 | Neuer Ort |
| `loc_crisis_watch` | Krisenwache | Orientierung & Sicherheit | 62.0 | 92.0 | Neuer Ort |

---

## 3. Vollständige Kantenliste (Topologischer Graph)

| von | nach | Pfadtyp (`pathKind`) | Begründung (`reason`) |
|---|---|---|---|
| `loc_station` | `loc_methods_library` | `main-road` | Primärer Weg vom Bahnhof zur Verfahrensorientierung |
| `loc_station` | `loc_crisis_watch` | `paved-path` | Direkter und barrierefreier Notfall-Zugang |
| `loc_station` | `loc_group_campfire` | `trail` | Weg zu Gruppenangeboten |
| `loc_station` | `loc_second_opinion_house` | `paved-path` | Aufklärungsweg für Patientenrechte |
| `loc_methods_library` | `loc_goal_foundry` | `paved-path` | Übergang von Methodenwissen zur Zielklärung |
| `loc_methods_library` | `loc_rationale_cartography` | `radial-way` | Verbindung zu Erklärungsmodellen im Hochland |
| `loc_methods_library` | `loc_group_campfire` | `trail` | Vernetzung von Methoden und Gruppenformaten |
| `loc_goal_foundry` | `loc_progress_observatory` | `paved-path` | Von der Zielvereinbarung zur Verlaufsmessung |
| `loc_goal_foundry` | `loc_workshop` | `radial-way` | Direkter Übergang zur praktischen Werkstatt |
| `loc_goal_foundry` | `loc_values_observatory` | `bridge` | Verbindung zwischen Therapiezielen und Lebenswerten |
| `loc_progress_observatory` | `loc_second_opinion_house` | `paved-path` | Von der Verlaufsbeobachtung zur Zweitmeinung |
| `loc_progress_observatory` | `loc_lighthouse` | `radial-way` | Rückbindung an den zentralen Evidenzanker |
| `loc_second_opinion_house` | `loc_repair_dock` | `bridge` | Verbindung zu Konfliktklärung und Therapeutenwechsel |
| `loc_second_opinion_house` | `loc_crisis_watch` | `trail` | Verbindung von Beratung und Notfallhilfe |
| `loc_crisis_watch` | `loc_safety_house` | `trail` | Schneller Übergang zur basalen Stabilisierung |
| `loc_lighthouse` | `loc_thought_windmill` | `radial-way` | Zugang zu Kognitions- und Grübelthemen |
| `loc_lighthouse` | `loc_mindfulness_pavilion` | `paved-path` | Kurzer Weg zur Achtsamkeitspraxis |
| `loc_lighthouse` | `loc_resource_grove` | `paved-path` | Zugang zu Stärken und Ressourcen |
| `loc_lighthouse` | `loc_alliance_bridge` | `radial-way` | Verbindung zum Allianz- und Beziehungsraum |
| `loc_lighthouse` | `loc_workshop` | `main-road` | Direkter Verbindungskorridor zur Erprobungswerkstatt |
| `loc_thought_windmill` | `loc_thought_lab` | `paved-path` | Vom Grübelerleben zur strukturierten Gedankenprüfung |
| `loc_thought_windmill` | `loc_fog_marsh` | `trail` | Übergang zwischen Gedankenkreisen und Erschöpfung |
| `loc_thought_windmill` | `loc_mindfulness_pavilion` | `trail` | Gedanken wahrnehmen und loslassen |
| `loc_fog_marsh` | `loc_alarm_cliffs` | `trail` | Wetter des Erlebens: von Starre zu Alarm |
| `loc_fog_marsh` | `loc_stillwater_lake` | `trail` | Moorlandschaft zum Stillwassersee |
| `loc_alarm_cliffs` | `loc_courage_trail` | `trail` | Von der Angsterregung zum gestuften Mutpfad |
| `loc_alarm_cliffs` | `loc_body_observatory` | `trail` | Verständnis somatischer Notfallreaktionen |
| `loc_stillwater_lake` | `loc_safety_house` | `paved-path` | Aus dem emotionalen Rückzug in den Schutzraum |
| `loc_stillwater_lake` | `loc_echo_cave` | `trail` | Übergang von Taubheit zur Mustersuche |
| `loc_mask_market` | `loc_parts_house` | `paved-path` | Von äußeren Masken zu inneren Stimmen |
| `loc_mask_market` | `loc_self_compassion_garden`| `trail` | Masken ablegen mit Selbstfreundlichkeit |
| `loc_mask_market` | `loc_life_archive` | `trail` | Biografische Wurzeln der Selbstdarstellung |
| `loc_safety_house` | `loc_resource_grove` | `paved-path` | Von der Stabilisierung zur Stärkenaktivierung |
| `loc_safety_house` | `loc_boundary_bridge` | `paved-path` | Schutz durch klare Grenzen |
| `loc_self_compassion_garden` | `loc_resource_grove` | `trail` | Sanfte Selbstführung und Ressourcen |
| `loc_self_compassion_garden` | `loc_parts_house` | `paved-path` | Mitfühlender Umgang mit inneren Anteilen |
| `loc_resource_grove` | `loc_values_observatory` | `trail` | Von Stärken zu übergeordneten Lebenswerten |
| `loc_boundary_bridge` | `loc_perspective_square` | `bridge` | Brücke zwischen Abgrenzung und Perspektivwechsel |
| `loc_boundary_bridge` | `loc_closeness_distance_passage` | `trail` | Grenzen im Bindungskontext |
| `loc_values_observatory` | `loc_thought_lab` | `bridge` | Verbindung von Werten und kognitiver Bewertung |
| `loc_life_archive` | `loc_echo_cave` | `trail` | Von Lebensdaten zu repetitiven Mustern |
| `loc_life_archive` | `loc_rationale_cartography` | `paved-path` | Biografische Daten in Fallmodelle integrieren |
| `loc_life_archive` | `loc_teaser_psychoanalysis` | `trail` | Anbindung an psychodynamische Tradition |
| `loc_echo_cave` | `loc_closeness_distance_passage` | `trail` | Wiederholungsmuster in Beziehungen |
| `loc_closeness_distance_passage` | `loc_alliance_bridge` | `bridge` | Bindungserwartungen in der therapeutischen Beziehung |
| `loc_parts_house` | `loc_thought_lab` | `paved-path` | Innere Stimmen im Gedankenlabor untersuchen |
| `loc_rationale_cartography` | `loc_thought_lab` | `trail` | Fallkonzepte und kognitive Techniken |
| `loc_thought_lab` | `loc_workshop` | `main-road` | Kognitive Vorbereitung praktischer Übungen |
| `loc_thought_lab` | `loc_courage_trail` | `trail` | Kognitive Hypothesen durch Verhaltensexperimente testen |
| `loc_workshop` | `loc_courage_trail` | `trail` | Verhaltensexperimente im Gelände erproben |
| `loc_workshop` | `loc_emotion_studio` | `paved-path` | Handlungsorientierte und emotionsfokussierte Arbeit |
| `loc_workshop` | `loc_teaser_cbt` | `trail` | Anbindung an KVT-Tradition |
| `loc_emotion_studio` | `loc_body_observatory` | `trail` | Gefühle und Körpersignale verbinden |
| `loc_body_observatory` | `loc_mindfulness_pavilion` | `paved-path` | Körperwahrnehmung und Achtsamkeit |
| `loc_courage_trail` | `loc_teaser_cbt` | `trail` | Expositionsmethoden |
| `loc_alliance_bridge` | `loc_repair_dock` | `paved-path` | Vom Bündnis zur Klärung von Brüchen |
| `loc_alliance_bridge` | `loc_perspective_square` | `paved-path` | Kooperation und Perspektivenübernahme |
| `loc_repair_dock` | `loc_network_courtyard` | `trail` | Beziehungsklärung im weiteren sozialen Umfeld |
| `loc_perspective_square` | `loc_network_courtyard` | `paved-path` | Zirkuläres Fragen im Familiensystem |
| `loc_network_courtyard` | `loc_teaser_systemic` | `trail` | Anbindung an systemische Tradition |
| `loc_network_courtyard` | `loc_group_campfire` | `trail` | Soziale Systeme und Gruppentherapie |
| `loc_perspective_square` | `loc_teaser_humanistic` | `trail` | Anbindung an humanistische Tradition |

---

## 4. Erkundungsrouten (Routennetze)

### Route 1: Konkrete Strategien erproben
* **Didaktischer Fokus:** Praktisches Handeln, Verhaltensexperimente, Zielklärung und Stärkennutzung.
* **Stationenfolge:**
  `loc_workshop` ➔ `loc_thought_lab` ➔ `loc_courage_trail` ➔ `loc_goal_foundry` ➔ `loc_progress_observatory` ➔ `loc_resource_grove`

### Route 2: Tiefere Muster verstehen
* **Didaktischer Fokus:** Biografie, Bindungsmuster, innere Stimmen und Erklärungsmodelle.
* **Stationenfolge:**
  `loc_mask_market` ➔ `loc_life_archive` ➔ `loc_echo_cave` ➔ `loc_parts_house` ➔ `loc_rationale_cartography` ➔ `loc_self_compassion_garden`

### Route 3: Gedankenabstand gewinnen
* **Didaktischer Fokus:** Achtsamkeit, Defusion, Werteorientierung und Metakognition.
* **Stationenfolge:**
  `loc_thought_windmill` ➔ `loc_mindfulness_pavilion` ➔ `loc_values_observatory` ➔ `loc_thought_lab`

### Route 4: Körper & Gefühle einbeziehen
* **Didaktischer Fokus:** Affektregulation, Beruhigung, Somatik und Stabilisierung.
* **Stationenfolge:**
  `loc_alarm_cliffs` ➔ `loc_stillwater_lake` ➔ `loc_safety_house` ➔ `loc_body_observatory` ➔ `loc_emotion_studio` ➔ `loc_fog_marsh`

### Route 5: Beziehungen & Umfeld betrachten
* **Didaktischer Fokus:** Grenzen, Bündnis, Reparatur, Familie und Gruppenerfahrung.
* **Stationenfolge:**
  `loc_boundary_bridge` ➔ `loc_closeness_distance_passage` ➔ `loc_alliance_bridge` ➔ `loc_repair_dock` ➔ `loc_perspective_square` ➔ `loc_network_courtyard` ➔ `loc_group_campfire`

### Route 6: Der Versorgungsweg (Sachliche Orientierung)
* **Didaktischer Fokus:** Erste Schritte im Gesundheitssystem, Rechte, Verlauf und Notfallhilfe.
* **Stationenfolge:**
  `loc_station` ➔ `loc_methods_library` ➔ `loc_goal_foundry` ➔ `loc_progress_observatory` ➔ `loc_second_opinion_house`
* **Sonderanker:** `loc_crisis_watch` ist von jeder Station der Route und jedem Kartenpunkt barrierefrei erreichbar.

---

## 5. Semantisches Zoomverhalten (3 Stufen)

1. **Stufe 1 (Gesamtansicht – Scale 0.5x bis 0.8x):**
   * Sichtbar: 6 Landschaftsbezeichnungen, 3 betretbare Hauptanker (`loc_lighthouse`, `loc_station`, `loc_workshop`), Notfall-Icon (`loc_crisis_watch`) und reduzierte goldene Silhouetten der restlichen Landmarken ohne Textetiketten.
   * Keine optische Überfrachtung.

2. **Stufe 2 (Regionalansicht – Scale 0.8x bis 1.4x):**
   * Sichtbar: Vollständige Ortsnamen der Landmarken der fokussierten Region, markierte Wege und Nachbarschaftslinien.

3. **Stufe 3 (Ortsansicht – Scale 1.4x bis 2.2x):**
   * Sichtbar: Klick auf Landmarke öffnet die detaillierte Vorschaukarte mit Konzeptbild, Nutzerfrage, Thema, „Was dieser Ort nicht behauptet“, direkten Nachbarorten und Betreten-Button (bei implementierten Szenen).
