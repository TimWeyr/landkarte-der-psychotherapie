# Abschlussbericht: Wissens- und Evidenzarchitektur sowie erster Kompasspfad

> **Dokumentenstatus:** Abgeschlossen  
> **Projekt:** Landkarte der Psychotherapie  
> **Geltungsbereich:** Implementierung gemäß freigegebenem Plan V2.1  
> **Release-Status des Builds:** `BLOCKED_BY_DRAFT_CONTENT` (Erwartungsgemäß; alle Claims liegen methodisch sauber als redaktionelle Drafts vor, bis die Primärstellen im nächsten Review freigegeben werden).

---

## 1. Kurze Ergebniszusammenfassung

Die Version 0.1 der Psychotherapie-Landkarte wurde erfolgreich und ohne Bruch der bestehenden Anwendungsarchitektur um folgende Kernbestandteile erweitert:
1. **Wissenschaftliche Wissens- & Evidenzschicht (`src/data/knowledge/`):**
   * Vollständige Ontologie mit 8 Knotentypen (`KnowledgeNodeKind`), 6 Quellenarten (`SourceKind`), 7 Claim-Typen (`ClaimType`), 5 Evidenzgraden (`EvidenceLevel`) und spezifischen Relationen.
   * Kanonische Referenzhoheit: Ausschließlich `LocationNode` verknüpft Geografie mit Wissen (`knowledgeNodeIds`). `KnowledgeNode` bleibt 100 % frei von Kartenkoordinaten.
   * Generische Quellen- und Evidenzanzeige im `ActionModal` mit klaren Badges, Fundstellen (`locator`) und Zitatrollen.
2. **Erster nicht-algorithmischer Kompasspfad (`src/data/exploration/`):**
   * Ausgangspunkt beim Alltags-Erleben: *„Ich kann nicht abschalten und grüble ständig.“*
   * 5 gleichwertige, schulenübergreifende Arbeitsweisen.
   * Vollständiger vertikaler Pfad (Variante A): Richtung 1 hebt Schauplätze hervor und führt zur betretbaren **„Werkstatt der Erprobung“** (`scene_workshop`) mit inhaltlichem Hotspot und einer freiwillig speicherbaren Leitfrage für das persönliche Erstgespräch im Rucksack.
3. **Kartenhervorhebung & Multi-Touch Gesten (`src/engine/`):**
   * Landmarken-Highlighting mit pulsierendem Leuchtring und Multi-Ziel-Fokus (`fitLocations()`).
   * Echtes Multi-Touch Pinch-to-Zoom für Tablets mit Pointer-Capture und Grenzwert-Clamping.
4. **Verlustfreie Persistenz & Test-Pipeline:**
   * Härtung von `storage.ts` mit Recovery-Backups bei Beschädigung (`psychotherapie_landkarte_corrupted_recovery_*`).
   * Rucksackzähler zählt nur noch physisch sichtbare Sammelobjekte.
   * Automatisierte Testsuite mit Vitest (`tests/knowledgeValidation.test.ts`, `tests/storage.test.ts`), fest eingebunden in `npm run build`.

---

## 2. Vollständige Liste aller veränderten und neuen Dateien

### Neu erstellte Dateien (12)
| Datei | Zweck |
|---|---|
| `src/types/content.ts` | Strikte Typdefinitionen für Wissensgraph, Claims, Quellen, Relationen und didaktische Routen. |
| `src/data/knowledge/sources.ts` | Strukturierte Quellen-Registry (G-BA, KBV, SGB V, Wampold, Horvath, Goldberg 2026, Narrative). |
| `src/data/knowledge/claims.ts` | Fachliche Aussagen mit Zitationen, Locators, Evidenzlevel und Claim-Typ. |
| `src/data/knowledge/nodes.ts` | Fachknoten (`experience`, `working-mode`, `intervention`, `approach`, `care-structure`, `collaboration`). |
| `src/data/knowledge/relations.ts` | Spezifische Relationen (`implements`, `acts-via`, `belongs-to`, `explores-aspect`, `examines-fit`). |
| `src/data/knowledge/index.ts` | Registry und typsichere Zugriffsfunktionen für das Wissensmodell. |
| `src/data/exploration/routes.ts` | Didaktische Kompassrouten und 5 gleichwertige Arbeitsweisen. |
| `src/data/exploration/index.ts` | Exploration-Registry und Getter. |
| `src/data/scenes/workshop.ts` | Vollständige Zielszene „Werkstatt der Erprobung“ mit Handlungsschritten & Erstgesprächsfrage. |
| `public/assets/scenes/workshop.svg` | Schematisches Vektor-Hintergrundbild der Werkstatt im Stil der Visual Bible. |
| `src/validation/validateKnowledge.ts` | Validierungsmodul für strukturelle Integrität und Release-Gates. |
| `tests/knowledgeValidation.test.ts` | Automatisierter Vitest-Test für den Wissensgraphen. |
| `tests/storage.test.ts` | Automatisierter Vitest-Test für Persistenzhärtung und Recovery. |

### Geänderte Dateien (13)
| Datei | Wesentliche Anpassungen |
|---|---|
| `package.json` | `vitest` zu `devDependencies` hinzugefügt; Scripts `"test"` und `"build"` (`tsc && vitest run && vite build`) aktualisiert. |
| `src/types/index.ts` | Re-Export von `content.ts`. |
| `src/types/world.ts` | `LocationNode` um `knowledgeNodeIds?: string[]` und `teaserClaimIds?: string[]` erweitert. |
| `src/types/scene.ts` | `HotspotAction` als strikte Discriminated Union refaktoriert; `claimIds` an Dialog, Aktionen und Quiz verankert. |
| `src/data/worldData.ts` | `loc_workshop` als Schauplatz ergänzt; kanonische `knowledgeNodeIds` an allen Landmarken hinterlegt. |
| `src/data/scenes/lighthouse.ts` | `claimIds` hinterlegt; Kompasstisch-Hotspot (`act_lh_open_compass`) eingebunden. |
| `src/data/scenes/station.ts` | `claimIds` an allen Hotspots, Subtexten und Quiz-Erklärungen hinterlegt. |
| `src/data/scenes/index.ts` | `workshopScene` registriert. |
| `src/engine/LandmarkSprite.ts` | `isHighlighted`-Zustand mit leuchtendem Pulsring implementiert. |
| `src/engine/MapEngine.ts` | `highlightLocations()`, `clearHighlights()`, `fitLocations()` und Multi-Touch Pinch-to-Zoom implementiert. |
| `src/ui/ActionModal.ts` | Quellen-Akkordeon, Badges, Claim-Typen und Kompass-Routenanzeige integriert. |
| `src/ui/SceneView.ts` | `onRouteNavigate`-Weiterleitung an die Application verdrahtet. |
| `src/main.ts` | Multi-Location Highlighting, Kamerafokus, Route-Banner im HUD und `any`-Bereinigung durchgeführt. |
| `src/state/storage.ts` | `migrateStoredState()` mit Recovery-Key und `parseImportedState()` mit differenzierten Fehlern implementiert. |
| `src/state/store.ts` | Rucksackzähler (`getTotalCollectedCount`) korrigiert (zählt nur noch sichtbare Rucksackelemente). |
| `src/state/exporter.ts` | Auf `parseImportedState()` umgestellt. |
| `src/styles/dialogue.css` | Styles für Quellen-Akkordeon, Evidenz-Tags, Badges und Kompasskarten hinzugefügt. |
| `src/styles/map.css` | Styles für das schwebende Route-Highlight-Banner hinzugefügt. |
| `docs/TECHNICAL.md` | Dokumentation des Wissensgraphen, der Gesten und der Schichtentrennung aktualisiert. |
| `docs/CONTENT.md` | Didaktische Dokumentation der 5 Richtungen und Schauplätze aktualisiert. |

---

## 3. Matrix der 5 Kompass-Erkundungsrichtungen

Ausgangspunkt: *„Ich kann nicht abschalten und grüble ständig.“*

| Nr. | Erkundungsperspektive / Arbeitsweise | Ziel-Wissensknoten | Schulenübergreifende Methodenbeispiele | Status in V0.2 |
|:---:|---|---|---|:---:|
| **1** | **Konkrete Strategien & Handlungsmöglichkeiten ausprobieren** | `node_wm_concrete_action`<br/>`node_tech_behavioral_experiment`<br/>`node_tech_chair_work`<br/>`node_collab_fit_examination` | Verhaltensexperimente (KVT), Stuhldialoge (Gestalt/Schema), Beobachtungsaufgaben (Systemik) | **Vollständig begehbar** (`scene_workshop`) inkl. Erstgesprächsfrage |
| **2** | **Tiefere Muster & biografische Auslöser verstehen** | `node_wm_deep_patterns`<br/>`node_app_psychodynamic` | Unbewusste Konflikte, Bindungserfahrungen, Lebensthemen (Tiefenpsychologie, Schematherapie) | Teaser-Vorschau mit didaktischer Einordnung |
| **3** | **Gedanken mit innerem Abstand begegnen** | `node_wm_thought_distance` | Kognitive Defusion, Achtsamkeit, Metakognition (ACT, Metakognitive Therapie) | Teaser-Vorschau mit didaktischer Einordnung |
| **4** | **Körperliche Reaktionen & emotionale Blockaden einbeziehen** | `node_wm_body_emotion` | Somatische Wahrnehmung, Emotionsfokussierung, Atemregulation (EFT, Körperpsychotherapie) | Teaser-Vorschau mit didaktischer Einordnung |
| **5** | **Wechselwirkungen mit Umfeld & Beziehungen betrachten** | `node_wm_social_context`<br/>`node_app_systemic` | Soziale Rollen, familiäre Kontexte, Kommunikation, Ressourcen (Systemische Therapie, IPT) | Teaser-Vorschau mit didaktischer Einordnung |

---

## 4. Tabelle der angelegten Claims

| Claim-ID | Claim-Typ | Evidenzlevel | Review-Status | Primärquelle | Locator / Fundstelle |
|---|---|---|:---:|---|---|
| `claim_gba_guidelines` | `care-fact` | `not-applicable` | `draft` | `src_gba_psychotherapie_richtlinie` | § 11 & § 13 |
| `claim_therapeutic_alliance` | `association` | `well-supported` | `draft` | `src_horvath_symonds_1991`<br/>`src_wampold_imel_2015` | S. 142–146<br/>Kap. 3, S. 45–68 |
| `claim_evidence_perspectives` | `definition` | `well-supported` | `draft` | `src_wampold_imel_2015` | Kapitel 1 & 2 |
| `claim_care_116117_ptv11` | `care-fact` | `not-applicable` | `draft` | `src_kbv_terminservicestelle_2024` | Abschnitt Sprechstunde |
| `claim_care_funding_paths` | `care-fact` | `not-applicable` | `draft` | `src_sgb5_paragraph13` | § 13 Abs. 3 SGB V |
| `claim_action_oriented_rumination` | `process` | `well-supported` | `draft` | `src_grawe_1997`<br/>`src_narrative_rumination_action_2025` | Kap. Problembewältigung<br/>Synthesebericht S. 4–7 |
| `claim_fit_collaboration_dynamic` | `theory` | `limited` | `draft` | `src_goldberg_2026_prognostic` | Diskussion S. 12–15 |

---

## 5. Kennzeichnung offener und Draft-Inhalte

* **Draft-Claims:** Alle 7 Claims sind in dieser Phase ehrlich als `draft` gekennzeichnet, da vor einer öffentlichen Zertifizierung eine separate juristische und bibliografische Endabnahme der Originalstellen erfolgen muss.
* **Release-Gate Verhalten:**  
  Die Knowledge-Validierung meldet den Status `BLOCKED_BY_DRAFT_CONTENT`. Dies verhindert, dass unfertige Entwürfe versehentlich als finale, qualitätsgesicherte Fachinhalte freigegeben werden.
* **4 Teaser-Routen:** Die Richtungen 2 bis 5 sind als Vorschauen implementiert und werden in V0.3 mit eigenen Szenen ausgebaut.

---

## 6. Testergebnisse & Build-Befehle

### 6.1 Automatisierte Unit- und Validierungstests (`npm test`)
```text
> vitest run

 ✓ tests/storage.test.ts (4 tests) 12ms
 ✓ tests/knowledgeValidation.test.ts (3 tests) 14ms

 Test Files  2 passed (2)
      Tests  7 passed (7)
   Duration  1.21s
```

### 6.2 TypeScript Typecheck (`npx tsc --noEmit`)
* **Ergebnis:** `0 Fehler`. Vollständig typsicher.

### 6.3 Produktionsbuild (`npm run build`)
```text
> landkarte-der-psychotherapie@0.1.0 build
> tsc && vitest run && vite build

✓ 748 modules transformed.
dist/index.html               0.60 kB │ gzip:   0.38 kB
dist/assets/index-Cf36ar2q.css  28.19 kB │ gzip:   5.26 kB
dist/assets/index-CXUAYFif.js  387.20 kB │ gzip: 120.38 kB
✓ built in 9.55s
```

---

## 7. Manuelle Abnahme & Interaktionen

* **Maus & Pointer:**
  * Klick auf Landmarke öffnet Vorschau oder Szene.
  * Dragging pannt die Karte mit elastischem Grenzclamping.
* **Tastatur & Barrierefreiheit:**
  * `ESC` schließt geöffnete Dialoge, Quellen-Popups, den Rucksack oder kehrt zur Karte zurück.
  * `M` kehrt jederzeit zur Weltkarte zurück.
* **Kompass-Ablauf:**
  1. Betreten des Leuchtturms → Klick auf „Kompasstisch der Erkundung“.
  2. Dialog öffnet sich mit 5 gleichwertigen Optionen.
  3. Klick auf Option 1 („Konkrete Strategien ausprobieren“):
     * Schließt die Szene flüssig.
     * Kehrt zur Weltkarte zurück.
     * Hebt die Zielorte (u.a. Werkstatt der Erprobung) mit blau-goldenem Pulsring hervor.
     * Richtet die Kamera automatisch auf die Zielgruppe aus (`fitLocations`).
     * Zeigt HUD-Banner *„🧭 Hervorgehoben für: Konkrete Strategien & Handlungsmöglichkeiten (✕ Aufheben)“*.
  4. Klick auf die hervorgehobene „Werkstatt der Erprobung“:
     * Öffnet das neue Werkstatt-Tableau.
     * Klick auf „Die Werkbank der praktischen Schritte“ zeigt schulenübergreifende Erklärungen und Quellen.
     * Klick auf *„Als Frage für mein Erstgespräch merken“* legt den Bookmark-Eintrag im Rucksack ab.
* **Tablet Multi-Touch:**
  * Zwei-Finger-Gesten skalieren die Karte sanft um den Mittelpunkt zwischen beiden Fingern (`pinch-to-zoom`), mit Begrenzung auf Zoomstufe 0.5 bis 2.2.

---

## 8. Abweichungen vom Plan V2.1

* **Keine signifikanten Abweichungen:** Alle Anforderungen aus der Freigabe V2.1 wurden exakt umgesetzt.

---

## 9. Bekannte Einschränkungen & nächste Schritte

* **Ausbau der Teaser-Pfade (V0.3):** Die Schauplätze für Tiefenpsychologie, Achtsamkeit, Körperpsychotherapie und Systemik sind als Landmarken und didaktische Vorschaukarten angelegt, besitzen aber noch keine begehbaren Point-and-Click-Tableaus.
* **Review-Status:** Sobald die Zitatfundstellen durch die Redaktion freigegeben sind, werden die Claims von `draft` auf `approved` umgestellt, wodurch der Release-Gate auf `RELEASE_READY` schaltet.

---

## 10. Ausdrückliche Bestätigung der Produktentscheidungen

Es wird ausdrücklich bestätigt:
1. **Kein Matching-Score und kein Scoring-System:** Es existieren keinerlei Eignungswerte, Prozente oder Vorhersage-Algorithmen.
2. **Keine Diagnose- oder Zuweisungsfunktion:** Beschwerden werden nicht in ICD-Kategorien eingeteilt; es wird keine „passende Therapieschule“ ermittelt.
3. **Rein explizite Nutzeraktionen:** Das Speichern von Reflexionsfragen, Interessen und Notizen erfolgt ausschließlich durch den bewussten Klick des Nutzers auf entsprechende Aktionsbuttons.
4. **Keine verdeckte Profilbildung:** Kartenhervorhebungen und Kameraschwenks sind flüchtige UI-Zustände und verändern den `UserState` nicht.

---

*Ende des Abschlussberichts.*
