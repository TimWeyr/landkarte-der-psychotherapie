# Verbindlicher Korrekturplan: Audit-Runde 2 (V0.2.1-Patch V2)

**Basis-Commit:** `59c36a0`  
**Zweck:** Vollständige Spezifikation der ausstehenden Auditkorrekturen vor der Code-Implementierung  
**Status:** Entwurf zur Prüfung (keine Programmdateien vor Freigabe verändert)

---

## 1. Übersicht & Zielsetzung

Dieser Plan definiert die verbindlichen Korrekturschritte für Audit-Runde 2:
1. **Zweistufige Fail-Closed-Validierung** aller strukturellen Referenzen (`NAVIGATE_ROUTES.routeId`, `RouteOption.bookmarkId`, `LocationNode.regionId`, `Region.id`-Eindeutigkeit, `Condition.targetId` nach Typ, `itemId`-Eindeutigkeit) zur Vermeidung von Vorwärtsreferenz-Fehlern, abgesichert durch negative DI-Tests mit Prüfung von `isValid === false` und `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
2. **Korrektur der Versorgungsinhalte** gemäß offizieller KBV-Vorgabe (Sprechstundenpflicht von mind. 50 Min. vor Akutbehandlung/Probatorik; exakte Nennung der beiden KBV-Ausnahmen: Vorstationär/Reha und Therapeutenwechsel während laufender Psychotherapie).
3. **Fachliche Bereinigung von G-BA und Goldberg 2026** in sämtlichen sichtbaren Texten und Szenen (Trennung von Leistungsrecht und empirischer Wirksamkeit; Goldberg strikt als Nullbefund der 38 statischen Vorabmerkmale; Passung als eigenständiges Beziehungsmodell).
4. **Architektonisch sauberes Routing & ARIA-Grundfunktionalität** (generischer Ausschluss des aktuellen Ausgangsortes via `originLocationId`; Auflösung und Anzeige aller Teaser-Node-Claims; `aria-expanded` und `aria-controls` für alle Akkordeons; `role="dialog"` und `aria-modal="true"` für Modale; reale öffentliche UI-Interaktionstests in `tests/uiEvidence.test.ts`).
5. **Bereinigung der Dokumentation** (Entfernen veralteter Relationstypen aus `docs/TECHNICAL.md`; standardisiertes Berichtsformat ohne selbstreferentielles SHA-Feld; Verzicht auf unbelegte Pauschalaussagen).

---

## 2. Detaillierte Maßnahmen nach Komponenten

### 2.1 Komponente 1: Zweistufige Fail-Closed-Validierung (`src/validation/validateKnowledge.ts`)

#### Zu ändernde Datei:
* `[MODIFY]` `src/validation/validateKnowledge.ts`

#### Architektur des zweistufigen Validators:
Um Vorwärtsreferenzen (z. B. wenn eine RouteOption auf eine Bookmark-Aktion einer erst später traversierten Szene verweist) fehlerfrei zu verarbeiten, wird die Validierung strikt in zwei Phasen unterteilt:

* **Phase 1 (Vollständige Indizierung & Eindeutigkeitsprüfung):**
  1. Alle `Region.id` in `data.worldData.regions` auf Duplikate prüfen und in `regionMap` indizieren.
  2. Alle `LocationNode.id` in `data.worldData.locations` auf Duplikate prüfen und in `locationMap` indizieren.
  3. Alle `Scene.id` in `data.scenesRegistry` auf Duplikate prüfen und in `sceneMap` indizieren.
  4. Alle `Hotspot.id` in allen Szenen auf Duplikate prüfen und in `hotspotMap` indizieren.
  5. Alle `Action.id` in allen Hotspots auf Duplikate prüfen und in `actionMap` (inkl. `action.type`) indizieren.
  6. Alle `item.itemId` in allen `ITEM`-Aktionen auf globale Duplikate prüfen und in `itemMap` indizieren.
  7. Alle `QUIZ`-Aktionen in `quizActionMap` indizieren.
  8. Alle `BOOKMARK`-Aktionen in `bookmarkActionMap` indizieren.

* **Phase 2 (Referenz- & Konsistenzprüfung):**
  1. **`NAVIGATE_ROUTES.routeId`:** Jede Aktion vom Typ `NAVIGATE_ROUTES` muss auf eine in `data.routes` vorhandene `route.id` zeigen.
  2. **`RouteOption.bookmarkId`:** Falls vorhanden, muss `bookmarkId` in `bookmarkActionMap` existieren (zeigt auf eine reale `BOOKMARK`-Aktion).
  3. **`LocationNode.regionId`:** Muss in `regionMap` existieren.
  4. **`Condition.targetId` (typspezifisch):**
     * `cond.type === 'VISITED'` ➔ `cond.targetId` muss in `locationMap` existieren.
     * `cond.type === 'ITEM_COLLECTED'` ➔ `cond.targetId` muss in `itemMap` existieren.
     * `cond.type === 'QUIZ_SOLVED'` ➔ `cond.targetId` muss in `quizActionMap` existieren.
  5. **Scene ↔ Location:** Bidirektionale 1:1-Beziehung zwischen begehbaren Locations und registrierten Szenen.

Jeder Verstoß erzeugt einen Fehler mit `level: 'ERROR'`. Der Report liefert:
* `report.isValid = false`
* `report.releaseStatus = 'BLOCKED_BY_VALIDATION_ERRORS'`

---

### 2.2 Komponente 2: Versorgungsinhalte (`src/data/knowledge/claims.ts`, `docs/CONTENT.md`)

#### Zu ändernde Dateien:
* `[MODIFY]` `src/data/knowledge/claims.ts`
* `[MODIFY]` `docs/CONTENT.md`

#### Spezifikation der inhaltlichen Korrekturen:
* **`claim_care_116117_ptv11`:**
  * *Statement:*
    > „Nach den Regelungen für die ambulante GKV-Psychotherapie müssen vor Beginn probatorischer Sitzungen oder einer Akutbehandlung grundsätzlich mindestens 50 Minuten Psychotherapeutische Sprechstunde stattgefunden haben. Das Formblatt PTV 11 dokumentiert die Ergebnisse der Sprechstunde und die Empfehlungen für das weitere Vorgehen.“
  * *PublicExplanation:*
    > „Über die Terminservicestelle 116 117 können zeitnah Termine für eine Sprechstunde vermittelt werden. Die Sprechstunde ist die reguläre diagnostische Erstabklärung vor einer Richtlinientherapie oder Akutbehandlung. Auf der Informationsseite der KBV werden als Ausnahmen von der vorherigen Sprechstundenpflicht genannt: (1) Eine vorherige stationäre Krankenhaus- oder Rehabilitationsbehandlung aufgrund einer psychischen Erkrankung mit einer ambulant psychotherapeutisch behandelbaren Diagnose sowie (2) ein Therapeutenwechsel während einer laufenden Psychotherapie.“
  * *Limitations:*
    > „Dies sind die von der Kassenärztlichen Bundesvereinigung (KBV) für den ambulanten Bereich benannten Ausnahmetatbestände von der Sprechstundenpflicht.“
* Angleichung von Abschnitt 3.2 in `docs/CONTENT.md` an diese Vorgaben.

---

### 2.3 Komponente 3: Bereinigung von G-BA und Goldberg 2026 in sichtbaren Texten

#### Zu ändernde Dateien:
* `[MODIFY]` `src/data/scenes/lighthouse.ts`
* `[MODIFY]` `src/data/scenes/workshop.ts`
* `[MODIFY]` `docs/CONTENT.md`

#### Spezifikation:
1. **`lighthouse.ts` (`lh_wall_charts`):**
   * *Dialogtext:*
     > „Der Gemeinsame Bundesausschuss (G-BA) legt als Selbstverwaltungsorgan fest, welche psychotherapeutischen Behandlungsverfahren von den gesetzlichen Krankenkassen erstattet werden (Richtlinienverfahren: Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie und systemische Therapie). Dieser sozialrechtliche Zulassungsstatus regelt den Leistungsanspruch im deutschen Kassensystem, stellt jedoch keine vergleichende Rangfolge oder qualitative Überlegenheitsaussage therapeutischer Traditionen dar.“
   * *Subtext:*
     > „Die Psychotherapie-Richtlinie definiert den formalen Rahmen der Leistungsübernahme durch die gesetzliche Krankenversicherung.“
2. **`workshop.ts` (`ws_collaboration_desk`):**
   * *Arrays & Zuordnungen:*
     * `dialogue.claimIds`: `['claim_fit_collaboration_dynamic', 'claim_therapeutic_alliance']` (kein Goldberg-Claim im Dialogkopf)
     * `dialogue.subtextClaimIds`: `['claim_therapeutic_alliance']`
     * Goldberg-Aktion (`act_ws_interest_goldberg_fit`):
       * `type`: `'INTEREST'`
       * `label`: `„Das interessiert mich: Nullbefund zu Vorabmerkmalen (Goldberg et al., 2026)“`
       * `description`: `„Die 38 in dieser Untersuchung erhobenen statischen Vorabmerkmale von Therapeutinnen und Therapeuten zeigten weitgehend keine statistische Vorhersagekraft für die Behandlungsergebnisse.“`
       * `claimIds`: `['claim_therapist_characteristics_null_finding']` (ausschließlich dieser Claim)
   * Das dynamische Passungsmodell („Passung entwickelt sich im Dialog“) wird separat durch `claim_fit_collaboration_dynamic` begründet und nicht als Schlussfolgerung aus Goldberg dargestellt.

---

### 2.4 Komponente 4: Generisches Routing, Teaser-Evidenz & ARIA-Grundfunktionalität

#### Zu ändernde Dateien:
* `[MODIFY]` `src/main.ts`
* `[MODIFY]` `src/ui/ActionModal.ts`
* `[MODIFY]` `src/ui/SceneView.ts`

#### Spezifikation:
1. **Generisches Routing:**
   * Signatur in `src/main.ts`:
     ```typescript
     export function computeRouteNavigationEffect(
       option: RouteOption,
       locations: LocationNode[],
       originLocationId?: string
     ): RouteNavigationResult
     ```
   * Für `opt_concrete_action`:
     Filtert Schauplätze nach Übereinstimmung in `knowledgeNodeIds` und schließt den übergebenen Ausgangsort aus (`loc.id !== originLocationId`).
     Bei Aufruf mit `originLocationId: 'loc_lighthouse'` liefert der Produktionsdatensatz exakt `['loc_workshop']`.
   * Für Optionen 2–5: Liefert deterministisch `[]` und `isNeutralPerspective: true`.
   * In `Application.openScene()` wird der aktuelle Ort `scene.locationId` vorgehalten und beim Aufruf von `handleRouteNavigation()` an `computeRouteNavigationEffect()` übergeben.

2. **Teaser-Evidenz-Auflösung:**
   * Extraktion eines dedizierten Renderers/Controllers für Teaser-Karten (`renderTeaserCardHtml(location, knowledgeNodes)`).
   * Auflösen von `location.knowledgeNodeIds` über `getNodeById()`.
   * Zusammenführen der Claims aus `location.teaserClaimIds` und den aufgelösten `node.claimIds`, dedupliziert.
   * Anzeige des gemeinsamen Evidenz-Akkordeons in der Teaser-Vorschaukarte.

3. **ARIA-Grundfunktionalität bei Akkordeons:**
   * Button: `id="btn-acc-${prefix}"`, `aria-expanded="false"`, `aria-controls="body-acc-${prefix}"`.
   * Body: `id="body-acc-${prefix}"`, `role="region"`, `aria-labelledby="btn-acc-${prefix}"`.
   * Beim Umschalten aktualisiert der Event-Listener `btn.setAttribute('aria-expanded', (!isHidden).toString())`.

4. **ARIA-Grundfunktionalität bei Modalen:**
   * Dialogbox: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title-${prefix}"`.
   * Titel-Element: `id="modal-title-${prefix}"`.

---

### 2.5 Komponente 5: Test-Suite & UI-Interaktionstests

#### Zu ändernde Dateien:
* `[MODIFY]` `tests/fixtures/knowledgeFixtures.ts`
* `[MODIFY]` `tests/knowledgeValidation.test.ts`
* `[NEW]` `tests/uiEvidence.test.ts`

#### Spezifikation der Testfälle:

1. **In `tests/knowledgeValidation.test.ts` (Validatortests):**
   * Negativtest: `NAVIGATE_ROUTES.routeId` zeigt auf nicht existierende Route ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: `RouteOption.bookmarkId` zeigt auf nicht existierende oder Nicht-BOOKMARK-Aktion ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: Doppelte Region-ID ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: `LocationNode.regionId` zeigt auf unbekannte Region ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: Doppelte `itemId` in `ITEM`-Aktionen ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: `Condition.targetId` mit `VISITED` auf unbekannte Location ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: `Condition.targetId` mit `ITEM_COLLECTED` auf unbekannte `itemId` ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Negativtest: `Condition.targetId` mit `QUIZ_SOLVED` auf unbekannte Quiz-Action-ID ➔ `isValid === false`, `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
   * Routing-Test: `computeRouteNavigationEffect` mit `originLocationId: 'loc_lighthouse'` ergibt exakt `['loc_workshop']`; mit künstlichem Ausgangsort wird dieser ausgeschlossen; keine State-Mutation.

2. **In `tests/uiEvidence.test.ts` (Öffentliche UI-Interaktionstests via happy-dom):**
   * `ActionModal.open()` mit realem Kompass-Hotspot: Klick auf Disclaimer-Button und Perspektiven-Button prüft Sichtbarkeit von `.sources-body` und Änderung von `aria-expanded` von `"false"` auf `"true"`.
   * `SceneView` mit realer `LocationNode`: Klick auf `btn-scene-evidence` prüft das Erscheinen des Modals mit `role="dialog"`, `aria-modal="true"` und passendem `aria-labelledby`.
   * Teaser-Evidenz: Klick auf Akkordeon der Teaser-Karte prüft Sichtbarkeit der Schauplatz-Claims und ARIA-Attribute.
   * Keine Verwendung von `as any` oder privaten Methodenaufrufen.

---

### 2.6 Komponente 6: Bereinigung der Dokumentation

#### Zu ändernde Dateien:
* `[MODIFY]` `docs/TECHNICAL.md`
* `[MODIFY]` `docs/CONTENT.md`

#### Spezifikation:
* `docs/TECHNICAL.md`: Bereinigung des Relationstypen-Katalogs (vollständige Entfernung von `evokes-need` und `addresses-need`).
* `docs/CONTENT.md`: Aktualisierung der Abschnitte zu KBV-Sprechstunde, G-BA und Goldberg 2026.
* Verzicht auf unbelegte Pauschalaussagen ("lückenlos", "vollumfänglich", "vollständig barrierefrei").

---

## 3. Risiken & Vorkehrungen

| Risiko | Gegenmaßnahme |
|---|---|
| Vorwärtsreferenzen bei `bookmarkId` führen zu Fehlalarmen im Validator | Zweiphasige Validierung: Vollständige Vorab-Indizierung aller Actions vor der Referenzprüfung. |
| DOM-Event-Listener bei mehrfachen Renderings doppelt registriert | `data-has-accordion-listener` Attribut oder Kapselung im Render-Zyklus. |
| Ursprungsort-Filterung schließt fälschlicherweise echte Zielorte aus | `originLocationId` wird explizit und optional übergeben; nur der aktuelle Schauplatz wird ausgeschlossen. |

---

## 4. Verbindliche Übergabephase & Commit-Strategie

Nach formaler Freigabe dieses Plans wird die Umsetzung strikt in folgenden Schritten durchgeführt:

1. **Schritt 1: Code-Implementierung & Testausführung**
   * Umsetzung aller Änderungen in Code, Daten, UI und Tests.
   * Ausführen aller Prüfkommandos (`npm test`, `npm run check:technical`, `npm run build:technical`, `npm run validate:release`, `npm run build`).
   * Erstellen des ersten Commits: **Ausschließlich Code, Tests und dazugehörige Inhaltsdokumentation**.
   * Auslesen des resultierenden Commit-SHAs (z. B. `abc1234`).

2. **Schritt 2: Erstellung des Abschlussberichts**
   * Erstellen von `docs/IMPLEMENTATION_REPORT_V02_AUDIT_ROUND2.md`.
   * Der Bericht enthält:
     - Basis-Commit (`59c36a0`) und den konkreten Code-Commit-SHA aus Schritt 1 (kein selbstreferentielles Report-SHA-Feld).
     - Vollständige Liste aller geänderten Dateien.
     - Tatsächliche Testzahlen (Gesamt und pro Suite).
     - Jedes Prüfkommando mit konkretem Exit-Code und Ausgabezusammenfassung.
     - Die 8 dynamisch ermittelten erreichbaren Draft-Claim-IDs.
     - SHA-256 Bundle-Prüfsumme von `dist/` vor und nach dem fehlgeschlagenen Release-Build (Nachweis der Unverändertheit).
     - Bestätigung aller durchgeführten UI-Interaktionstests.
     - Dokumentation aller eventuellen Abweichungen vom Plan.
   * Erstellen des zweiten Commits: **Ausschließlich der Abschlussbericht**.

3. **Schritt 3: Push & Stopppunkt**
   * `git push origin main` beider Commits.
   * Stopppunkt zur Prüfung durch den Nutzer.
