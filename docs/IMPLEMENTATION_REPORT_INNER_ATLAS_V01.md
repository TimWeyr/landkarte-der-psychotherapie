# Abschlussbericht: Innerer Psychotherapie-Atlas V0.1 (30 neue Orte / 37 Landmarken)

**Projekt:** Psychotherapie-Landkarte  
**Branch:** `prototype/inner-atlas-v01`  
**Datum:** 03. September 2026  
**Status:** Visueller und interaktiver Prototyp vollständig implementiert und getestet.

---

## 1. Übersicht & Commit-Struktur

Die Umsetzung erfolgte isoliert auf dem Branch `prototype/inner-atlas-v01` in drei strukturierten Commits:

1. **Commit 1 (`f20f282`):** `docs(atlas-v01): define 30-location inner map and navigation graph`
   * `docs/INNER_MAP_ATLAS_V01.md` (37 Schauplatz-Definitionen mit 12 Attributfeldern)
   * `docs/INNER_MAP_NAVIGATION_V01.md` (Topologie, Koordinaten, 62 Kanten, 6 Routen)
2. **Commit 2 (`b901abd`):** `feat(atlas-v01): add visual assets and interactive inner map prototype`
   * Master-Kartenbild (`public/assets/prototypes/inner-atlas-v01/map/inner_atlas_world.jpg`)
   * 30 Landmark-Silhouetten (SVG) und 30 Szenen-Konzeptbilder (SVG, 960×540, 16:9)
   * Kontaktübersichten für Landmarken und Szenen
   * Prototyp-Module: `src/prototypes/innerAtlas/` (`atlasLocations.ts`, `atlasEdges.ts`, `atlasRoutes.ts`, `InnerAtlasView.ts`)
   * Routing-Weiche in `src/main.ts` (`?prototype=inner-atlas-v01`) und Stylesheet `src/styles/innerAtlas.css`
   * Test-Suite `tests/innerAtlasPrototype.test.ts` (6 neue Integrationstests)
3. **Commit 3:** `docs(atlas-v01): add prototype report and asset manifest`
   * `docs/ASSET_MANIFEST_INNER_ATLAS_V01.md` (Manifest aller 60 erzeugten Bild-Assets mit SHA-256)
   * `docs/IMPLEMENTATION_REPORT_INNER_ATLAS_V01.md` (dieser Abschlussbericht)

---

## 2. Die 30 neuen Schauplätze im Prototyp

### A. Wetter des Erlebens (Nord & Zentrum)
1. `loc_thought_windmill` – **Windmühle der Gedanken** (Grübeln, Sorgen, kognitive Defusion)
2. `loc_fog_marsh` – **Nebelmoor der Erschöpfung** (Antriebslosigkeit, Brain Fog, Pacing)
3. `loc_alarm_cliffs` – **Alarmklippen** (Angst, Panik, autonome Stressreaktionen)
4. `loc_stillwater_lake` – **Stillwassersee** (Emotionale Taubheit, Rückzug, Schutzstarre)
5. `loc_mask_market` – **Maskenmarkt** (Perfektionismus, Scham, soziale Anpassung)

### B. Bedürfnisse & Ressourcen (Westliches Zentrum)
6. `loc_safety_house` – **Schutzhaus** (Stabilisierung, Reizreduktion, innere Sicherheit)
7. `loc_self_compassion_garden` – **Garten der Selbstfreundlichkeit** (Selbstmitgefühl, Kintsugi, Selbstkritik)
8. `loc_resource_grove` – **Ressourcenhain** (Stärken, Ressourcenaktivierung, Resilienz)
9. `loc_boundary_bridge` – **Grenzbrücke** (Abgrenzung, Assertivität, People-Pleasing)
10. `loc_values_observatory` – **Sternwarte der Werte** (Werteklärung, Sinn, Autonomie)

### C. Lebensgeschichte & Muster (Nordwest-Hochland)
11. `loc_life_archive` – **Archiv der Lebensspuren** (Biografie, Entwicklung, Übergänge)
12. `loc_echo_cave` – **Echohöhle der Muster** (Wiederholungszwänge, Schemata, Zyklen)
13. `loc_closeness_distance_passage` – **Passage von Nähe und Abstand** (Bindungsmuster, Beziehungsregulation)
14. `loc_parts_house` – **Haus der inneren Stimmen** (Innere Anteile, Modi, innerer Kritiker)
15. `loc_rationale_cartography` – **Kartenkammer der Erklärungsmodelle** (Biopsychosoziale Fallkonzepte)

### D. Veränderungsprozesse (Östliche Werk- & Gartenlandschaft)
16. `loc_thought_lab` – **Gedankenlabor** (Sokratischer Dialog, kognitive Umstrukturierung)
17. `loc_emotion_studio` – **Gefühlsatelier** (Emotionsdifferenzierung, EFT, Ausdruck)
18. `loc_body_observatory` – **Körperobservatorium** (Interozeption, somatische Marker, somatische Abklärung)
19. `loc_courage_trail` – **Mutpfad** (Graduierte Exposition, Verhaltensexperimente)
20. `loc_mindfulness_pavilion` – **Achtsamkeitspavillon** (Gegenwartsbezug, Open Monitoring, MBSR)

### E. Beziehung & Kontext (Westen & Südwesten)
21. `loc_alliance_bridge` – **Bündnisbrücke** (Working Alliance, Ziele, Aufgaben, Bindung)
22. `loc_repair_dock` – **Reparaturdock** (Allianzbrüche, Rupture & Repair, Konfliktklärung)
23. `loc_perspective_square` – **Platz der Perspektiven** (Mentalisieren, zirkuläre Fragen)
24. `loc_network_courtyard` – **Netzwerkhof** (Systemische Familie, Genogramme, soziale Rollen)
25. `loc_group_campfire` – **Gruppenfeuer** (Gruppentherapie, Universalität, Kohäsion)

### F. Orientierung & Sicherheit (Süd & Südost)
26. `loc_methods_library` – **Bibliothek der Verfahren** (G-BA Richtlinienstatus, Methoden-Taxonomie)
27. `loc_goal_foundry` – **Zielschmiede** (Partizipative Zielklärung, flexible Anpassung)
28. `loc_progress_observatory` – **Verlaufswarte** (Routine Outcome Monitoring, Feedback, Stagnation)
29. `loc_second_opinion_house` – **Haus der zweiten Meinung** (Patientenrechte, Zweitmeinung, Wechsel)
30. `loc_crisis_watch` – **Krisenwache** (24/7 Akuthilfe, Notfallnummern, Krisenintervention)

---

## 3. Navigationsmodell & Interaktion

1. **Freies Erkunden & Vorschaukarten:**
   * Jeder der 37 Schauplätze lässt sich auf der Karte anklicken und öffnet eine interaktive Vorschaukarte.
   * Die Vorschaukarte zeigt: Landschaft, Nutzerfrage, Themenschwerpunkt, **„Was dieser Ort nicht behauptet“**, Konzept-Grafik und Schnellwahltasten für 2–4 direkte Nachbarorte.
   * Nur die drei produktiv ausgebauten Szenen (`loc_lighthouse`, `loc_station`, `loc_workshop`) bieten einen aktiven Button *„Ort betreten“*, der die Point-and-Click-Szene öffnet. Alle 30 neuen Orte sind transparent als `concept-draft` deklariert.
2. **5 Kompass-Routennetze & Versorgungsweg:**
   * Über die obere Filterleiste können die 5 schulenübergreifenden Erkundungsrichtungen sowie der Versorgungsweg aktiviert werden.
   * Nicht zur Route gehörende Orte werden sanft abgedunkelt (`opacity: 0.3`); verbindende Wegstrecken werden animiert hervorgehoben.
   * Die Auswahl einer Route verändert **keinen persistenten Nutzerzustand** und leitet keine Typisierungen ab.
3. **Semantischer Zoom:**
   * **Gesamtansicht (Zoom < 0.8x):** Reduzierte Darstellung; Textlabels ausgeblendet, nur Landschaftsmarken und Hauptanker sichtbar.
   * **Regionalansicht (0.8x – 1.4x):** Alle Ortsnamen und Pfade sichtbar.
   * **Detailansicht (> 1.4x):** Fokussierung auf ausgewählte Landmarken und Nachbarschaften.
4. **Krisenwache-Schnellzugriff:**
   * Von jeder Stelle der Karte aus über den roten Notfall-Button in der Kopfzeile erreichbar.

---

## 4. Testergebnisse & Build-Integrität

| Test-Kommando | Erwartung | Ergebnis |
|---|---|---|
| `npm test` | Exit 0 | **45/45 Tests bestanden** (6 Suiten, inkl. 6 neue Topologie- & Interaktionstests) |
| `npm run check:technical` | Exit 0 | **TypeScript & Vitest fehlerfrei** |
| `npm run build:technical` | Exit 0 | **Produktions-Bundle erfolgreich gebaut** |
| `npm run validate:release` | Exit 1 (Drafts) | **Keine Validierungsfehler** (8 Produktions-Drafts blockieren wie vorgesehen das Release-Gate; Prototyp-Orte stören nicht) |

---

## 5. Konzeptkonfidenz & Ausbau-Empfehlung

### Schauplätze mit besonders hoher Konzeptkonfidenz (≥ 95 %):
* `loc_thought_windmill` (Windmühle der Gedanken): Klares didaktisches Modell zur Entlastung bei Grübelschleifen.
* `loc_safety_house` (Schutzhaus): Grundlegende Bedeutung von Reizreduktion und Stabilisierung vor Exposition.
* `loc_thought_lab` (Gedankenlabor): Direkter Anschluss an KVT-Interventionen der Werkstatt.
* `loc_alliance_bridge` (Bündnisbrücke): Empirisch am stärksten gestützter schulenübergreifender Wirkfaktor.
* `loc_methods_library` (Bibliothek der Verfahren): Dringend benötigte Entwirrung von Verfahren, Methoden und Techniken.

### Schauplätze mit noch höherem Klärungsbedarf / mittlerer Konfidenz (≤ 85 %):
* `loc_fog_marsh` (Nebelmoor der Erschöpfung): Gradwanderung zwischen psychoedukativer Entlastung und Vermeidung von Leistungs- oder Aktivierungsdruck.
* `loc_body_observatory` (Körperobservatorium): Klare Trennung zwischen Körperachtsamkeit und notwendiger somatischer Differenzialdiagnostik.

---

## 6. Empfehlung: Die nächsten 5 auszubauenden Szenen

Sobald die redaktionelle Phase für vollständige Point-and-Click-Szenen freigegeben wird, sollten folgende fünf Schauplätze priorisiert als interaktive Szenen implementiert werden:

1. 🧭 **`loc_methods_library` (Bibliothek der Verfahren):**  
   *Begründung:* Bietet Nutzern direkt nach dem Bahnhof (`loc_station`) eine sachliche Orientierung über G-BA-Richtlinienverfahren, wissenschaftliche Anerkennung und schulenübergreifende Werkzeuge.
2. 🌬️ **`loc_thought_windmill` (Windmühle der Gedanken):**  
   *Begründung:* Löst das am häufigsten genannte Eingangserleben („Grübeln und ständiges Gedankenkreisen“) didaktisch schulenübergreifend auf.
3. 🛡️ **`loc_safety_house` (Schutzhaus):**  
   *Begründung:* Verankert basale Stabilisierung und Reizregulation als unverzichtbare Voraussetzung für Konfrontations- und Veränderungsarbeit.
4. 🔬 **`loc_thought_lab` (Gedankenlabor):**  
   *Begründung:* Bildet das kognitive Gegenstück zur bestehenden handlungsorientierten Werkstatt (`loc_workshop`) für sokratischen Dialog und Realitätstests.
5. 🌉 **`loc_alliance_bridge` (Bündnisbrücke):**  
   *Begründung:* Schafft die notwendige Brücke zwischen individuellen Beschwerden und der realen therapeutischen Zusammenarbeit (Ziele, Aufgaben, Beziehungsgestaltung).
