# Verbindlicher Korrekturplan: Audit-Runde 2 (V0.2.1-Patch)

**Basis-Commit:** `59c36a0`  
**Zweck:** Vollständige Spezifikation der ausstehenden Auditkorrekturen vor der Code-Implementierung  
**Status:** Entwurf zur Prüfung (keine Programmdateien vor Freigabe verändert)

---

## 1. Übersicht & Zielsetzung

Dieser Plan definiert die verbindlichen Korrekturschritte für Audit-Runde 2. Er adressiert:
1. **Lückenlose Fail-Closed-Validierung** aller strukturellen Referenzen (`NAVIGATE_ROUTES.routeId`, `RouteOption.bookmarkId`, `LocationNode.regionId`, `Region.id`-Eindeutigkeit, `Condition.targetId` nach Typ, `itemId`-Eindeutigkeit) mit dedizierten negativen DI-Tests.
2. **Korrektur der Versorgungsinhalte** gemäß offizieller KBV-Vorgabe (Sprechstundenpflicht auch vor Akutbehandlung/Probatorik; exakte Nennung der beiden KBV-Ausnahmen: Vorstationär/Reha und Therapeutenwechsel).
3. **Fachliche Textbereinigung zu G-BA und Goldberg 2026** in allen sichtbaren Szenen und Dialogen (Trennung von Leistungsrecht und empirischer Wirksamkeit; Goldberg strikt als Nullbefund der 38 statischen Merkmale; Passung als eigenständiges Beziehungsmodell).
4. **UI-Konsistenz & ARIA-Barrierefreiheit** (deterministisches Highlight `['loc_workshop']` bei Option 1 unter Ausschluss des Startortes; Zugänglichkeit der Teaser-Node-Claims; `aria-expanded` und `aria-controls` für alle Akkordeons; `role="dialog"` und `aria-modal="true"` für Modale; reale DOM-Interaktionstests).
5. **Bereinigung der Dokumentation** (Entfernen veralteter Relationstypen aus `docs/TECHNICAL.md`; Entfernen selbstreferentieller Report-Commit-Felder; Verzicht auf unbelegte Pauschalaussagen).

---

## 2. Detaillierte Maßnahmen nach Komponenten

### 2.1 Komponente 1: Fail-Closed-Validierung (`src/validation/validateKnowledge.ts`)

#### Zu ändernde Datei:
* `[MODIFY]` [`src/validation/validateKnowledge.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/validation/validateKnowledge.ts)

#### Spezifikation der neuen Validierungsregeln:
1. **`NAVIGATE_ROUTES.routeId`:**
   * Jede Hotspot-Aktion vom Typ `NAVIGATE_ROUTES` muss eine `routeId` besitzen, die in `data.routes` als `route.id` existiert.
   * Fehlerkategorie: `ONTOLOGY`, Entity: `action.id`.
2. **`RouteOption.bookmarkId`:**
   * Sofern `RouteOption.bookmarkId` definiert ist, muss in den registrierten Szenen (`data.scenesRegistry`) mindestens eine Aktion existieren mit `action.id === opt.bookmarkId` und `action.type === 'BOOKMARK'`.
   * Fehlerkategorie: `ONTOLOGY`, Entity: `opt.id`.
3. **`Region.id`-Eindeutigkeit & `LocationNode.regionId`:**
   * Alle `Region.id` in `data.worldData.regions` müssen eindeutig sein (Prüfung via `regionMap`).
   * Jedes `LocationNode.regionId` muss auf eine existierende `Region.id` in `data.worldData.regions` verweisen.
   * Fehlerkategorie: `INTEGRITY` (bei Duplikat) bzw. `CONSISTENCY` (bei unbekannter Region).
4. **`itemId`-Eindeutigkeit:**
   * Alle in `ITEM`-Aktionen vergebenen `item.itemId` müssen über alle Szenen hinweg global eindeutig sein (Prüfung via `itemMap`).
   * Fehlerkategorie: `INTEGRITY`, Entity: `item.itemId`.
5. **Typspezifische Validierung von `Condition.targetId`:**
   * Für jedes `Hotspot.conditions`:
     - Wenn `cond.type === 'VISITED'`: `cond.targetId` muss als `loc.id` in `data.worldData.locations` existieren.
     - Wenn `cond.type === 'ITEM_COLLECTED'`: `cond.targetId` muss als `item.itemId` in einer registrierten `ITEM`-Aktion existieren.
     - Wenn `cond.type === 'QUIZ_SOLVED'`: `cond.targetId` muss als `action.id` einer registrierten `QUIZ`-Aktion existieren.
   * Fehlerkategorie: `CONSISTENCY`, Entity: `hotspot.id`.

---

### 2.2 Komponente 2: Versorgungsinhalte (`src/data/knowledge/claims.ts`, `docs/CONTENT.md`)

#### Zu ändernde Dateien:
* `[MODIFY]` [`src/data/knowledge/claims.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/data/knowledge/claims.ts)
* `[MODIFY]` [`docs/CONTENT.md`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/docs/CONTENT.md)

#### Spezifikation der inhaltlichen Korrekturen:
* **`claim_care_116117_ptv11`:**
  * *Statement:* `„Die psychotherapeutische Sprechstunde (mindestens 50 Minuten bei Erwachsenen) ist die gesetzlich vorgeschriebene Erstabklärung und Voraussetzung vor Beginn einer Akutbehandlung oder Richtlinientherapie (Probatorik); das Formblatt PTV 11 dokumentiert die Ersteinschätzung.“`
  * *PublicExplanation:* `„Über die Terminservicestelle 116 117 können zeitnah Termine für eine Sprechstunde vermittelt werden. Eine vorherige Sprechstunde ist laut KBV auch vor einer Akutbehandlung oder probatorischen Sitzungen zwingend erforderlich. Ausnahmen gelten ausschließlich in zwei Fällen: (1) Nach einer stationären Krankenhaus- oder Rehabilitationsbehandlung (mit passender psychischer Diagnose) oder (2) bei einem Therapeutenwechsel während einer bereits laufenden, bewilligten Psychotherapie.“`
  * *Limitations:* `„Keine Ausnahmen für sonstige Kriseninterventionen oder Folgetherapien ohne vorherige stationäre Behandlung oder formalen Therapeutenwechsel.“`
* Angleichung von Abschnitt 3.2 in `docs/CONTENT.md` an diese exakten KBV-Regelungen.

---

### 2.3 Komponente 3: Bereinigung von G-BA und Goldberg 2026 in sichtbaren Texten

#### Zu ändernde Dateien:
* `[MODIFY]` [`src/data/scenes/lighthouse.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/data/scenes/lighthouse.ts)
* `[MODIFY]` [`src/data/scenes/workshop.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/data/scenes/workshop.ts)
* `[MODIFY]` [`docs/CONTENT.md`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/docs/CONTENT.md)

#### Spezifikation:
1. **`lighthouse.ts` (`lh_wall_charts`):**
   * Text ersetzt durch: `„Der Gemeinsame Bundesausschuss (G-BA) legt als Selbstverwaltungsorgan fest, welche psychotherapeutischen Behandlungsverfahren von den gesetzlichen Krankenkassen erstattet werden (Richtlinienverfahren: Verhaltenstherapie, tiefenpsychologisch fundierte Psychotherapie, analytische Psychotherapie und systemische Therapie). Dieser sozialrechtliche Zulassungsstatus regelt den Leistungsanspruch im deutschen Kassensystem, stellt jedoch keine vergleichende Rangfolge oder Bewertung therapeutischer Traditionen dar.“`
   * Subtext: `„Die Richtlinie definiert den formalen Versorgungsrahmen der gesetzlichen Krankenversicherung.“`
2. **`workshop.ts` (`ws_collaboration_desk`):**
   * Trennung von Goldberg und Passungsmodell:
     - Goldberg-Aktion (`act_ws_interest_goldberg_fit`): Text fokussiert strikt auf den Nullbefund: `„Empirischer Befund (Goldberg et al., 2026): Die 38 untersuchten statischen Vorabmerkmale von Therapeutinnen und Therapeuten (wie Persönlichkeit oder Bindungsstil) zeigten keine verlässliche Vorhersagekraft für Behandlungsergebnisse.“`
     - Dialogtext und Allianz-Aktion verweisen eigenständig auf `claim_fit_collaboration_dynamic` und `claim_therapeutic_alliance` (Passung als interaktiver Aushandlungsprozess).
3. **`docs/CONTENT.md`:**
   * Bereinigung der Formulierungen in Abschnitt 3.1 und 3.3.

---

### 2.4 Komponente 4: UI-Konsistenz, ARIA & Barrierefreiheit

#### Zu ändernde Dateien:
* `[MODIFY]` [`src/main.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/main.ts)
* `[MODIFY]` [`src/ui/ActionModal.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/ui/ActionModal.ts)
* `[MODIFY]` [`src/ui/SceneView.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/src/ui/SceneView.ts)

#### Spezifikation:
1. **Deterministisches Routing für Option 1:**
   * In `computeRouteNavigationEffect(option, locations)`:
     - Für `opt_concrete_action`: Zielorte filtern nach `loc.id !== 'loc_lighthouse'` und `loc.knowledgeNodeIds.includes(...)`.
     - Ergebnis: `highlightedLocationIds` ist exakt `['loc_workshop']`.
     - Für Optionen 2–5: `highlightedLocationIds` ist `[]`.
2. **Zugänglichkeit der Teaser-Node-Claims:**
   * In `showLocationTeaserCard(location, pos)`:
     - Ermittle alle Claims aus `location.teaserClaimIds` sowie den `location.knowledgeNodeIds`.
     - Binde das Evidenz-Akkordeon ein und aktiviere Event-Listener via `attachAccordionListeners(card)`.
3. **ARIA-Attribute für Akkordeons:**
   * Button: `id="btn-acc-${prefix}"`, `aria-expanded="false"`, `aria-controls="body-acc-${prefix}"`.
   * Body: `id="body-acc-${prefix}"`, `role="region"`, `aria-labelledby="btn-acc-${prefix}"`.
   * Beim Klick: `btn.setAttribute('aria-expanded', (!isHidden).toString())`.
4. **ARIA-Attribute für Modale (`ActionModal.ts`):**
   * Modalbox: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title-${uniqueId}"`.
   * Titel: `id="modal-title-${uniqueId}"`.
5. **Reale DOM-Interaktionstests:**
   * Tests für Klick auf Disclaimer-Akkordeon, Perspektiven-Akkordeon, Teaser-Akkordeon und Schauplatz-Evidenzmodal.

---

### 2.5 Komponente 5: Test-Suite & Fixture-Builder (`tests/`)

#### Zu ändernde Dateien:
* `[MODIFY]` [`tests/fixtures/knowledgeFixtures.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/tests/fixtures/knowledgeFixtures.ts)
* `[MODIFY]` [`tests/knowledgeValidation.test.ts`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/tests/knowledgeValidation.test.ts)

#### Spezifikation der Testfälle:
1. **Neue negative DI-Tests (müssen alle `BLOCKED_BY_VALIDATION_ERRORS` ergeben):**
   * `rejects action NAVIGATE_ROUTES with non-existent routeId`
   * `rejects route option with bookmarkId pointing to non-existent or non-BOOKMARK action`
   * `rejects duplicate region IDs`
   * `rejects location pointing to non-existent regionId`
   * `rejects duplicate item IDs across actions`
   * `rejects condition VISITED with non-existent locationId`
   * `rejects condition ITEM_COLLECTED with non-existent itemId`
   * `rejects condition QUIZ_SOLVED with non-existent quizActionId`
2. **Option 1 Routing-Test:**
   * `computeRouteNavigationEffect(opt_concrete_action, locations)` liefert exakt `['loc_workshop']` (Leuchtturm ausgeschlossen).
3. **DOM-Akkordeon & ARIA-Interaktionstest:**
   * Prüfung von `aria-expanded`, `aria-controls`, `role="dialog"` und `aria-modal="true"`.

---

### 2.6 Komponente 6: Dokumentation (`docs/`)

#### Zu ändernde Dateien:
* `[MODIFY]` [`docs/TECHNICAL.md`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/docs/TECHNICAL.md)
* `[MODIFY]` [`docs/CONTENT.md`](file:///c:/Users/timwe/Documents/webseiten/tw/landkarte-der-psychotherapie/docs/CONTENT.md)

#### Spezifikation:
* `docs/TECHNICAL.md`: Bereinigung des Relationstypen-Diagramms (keine Erwähnung von `evokes-need` / `addresses-need`).
* Verzicht auf nicht formal geprüfte Qualitätsversprechen ("lückenlos", "vollumfänglich").

---

## 3. Geplante Test- und Prüfschritte

Nach Freigabe und Umsetzung des Plans werden folgende Prüfkommandos ausgeführt:

1. `npm test` ➔ **Muss Exit-Code 0 liefern** (alle bestehenden und neuen Tests grün).
2. `npm run check:technical` ➔ **Muss Exit-Code 0 liefern** (`tsc --noEmit` und Vitest fehlerfrei).
3. `npm run build:technical` ➔ **Muss Exit-Code 0 liefern** (Vite Bundle baut sauber).
4. `npm run validate:release` ➔ **Muss Exit-Code 1 liefern** (ausschließlich blockiert durch die 8 erreichbaren Draft-Claims, 0 Validierungsfehler).
5. `npm run build` ➔ **Muss Exit-Code 1 liefern** (bricht vor `vite build` ab; Dist-Bundle unverändert).

---

## 4. Risiken & Vorkehrungen

| Risiko | Gegenmaßnahme |
|---|---|
| Zirkuläre Referenzprüfungen bei `RouteOption.bookmarkId` vs. `Action.id` | Zweistufige Validierung: Erst Indizierung aller Actions und Items in Maps, danach Konsistenzprüfung der Referenzen. |
| ARIA-Attribut-Fehler in isolierten Unit-Tests | Verwendung der konfigurierten `happy-dom`-Umgebung für standardkonforme DOM-Attribut-Prüfungen. |
| Startort `loc_lighthouse` wird versehentlich bei Option 1 mit markiert | Explizite Filterung in `computeRouteNavigationEffect` und strikter Assertion-Test auf `toEqual(['loc_workshop'])`. |
