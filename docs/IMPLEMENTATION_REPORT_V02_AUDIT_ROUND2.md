# Abschlussbericht: Audit-Korrekturen Runde 2 (V0.2.1-Patch V2)

**Projekt:** Psychotherapie-Landkarte (Zentralregion)  
**Fachlich geprüfter Ausgangscode:** `59c36a0`  
**Freigegebener Plan / Parent des Code-Commits:** `6d6e96c`  
**Code-Commit (SHA):** `7bc09c8`  
**Datum:** 03. September 2026  
**Status:** Audit-Korrekturen implementiert, verifiziert und getestet

---

## 1. Vollständige Liste der geänderten Dateien

Die folgenden 12 Dateien wurden im Code-Commit `7bc09c8` modifiziert bzw. erstellt:

1. `src/validation/validateKnowledge.ts` – Zweistufige Validierungsarchitektur (vollständige Vorab-Indizierung in Phase 1, typsichere Konsistenzprüfung in Phase 2)
2. `src/data/knowledge/claims.ts` – Exakte KBV-Vorgaben für Sprechstunde (§ 11/13 Psychotherapie-Richtlinie), Ausnahmekatalog und Trennung von Goldberg-Nullbefund und dynamischer Passung
3. `src/data/knowledge/index.ts` – Typflexible Implementierung von `getSourcesForClaim(claimOrId)`
4. `src/data/scenes/lighthouse.ts` – Klare Trennung von G-BA-Zulassung/Leistungsrecht und empirischem Schulranking
5. `src/data/scenes/workshop.ts` – Goldberg-Aktion isoliert als Nullbefund der 38 Vorabmerkmale; Allianz und dynamische Passung in separaten Claims
6. `src/data/worldData.ts` – Bereinigte Schauplatz-Zuordnungen für `loc_lighthouse` und `loc_workshop`
7. `src/main.ts` – Generisches Routing mit dynamischem `originLocationId`-Ausschluss und `renderTeaserCardHtml()`
8. `src/ui/ActionModal.ts` – ARIA-Grundfunktionalität (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, dynamisches `aria-expanded` und `aria-controls`)
9. `tests/knowledgeValidation.test.ts` – 17 Tests inklusive zweistufiger Negativ-DI-Tests und Positivtest für Vorwärtsreferenzen
10. `tests/uiEvidence.test.ts` – [NEU] 3 öffentliche UI-Interaktionstests (Kompass-Akkordeons, Schauplatz-Evidenzmodal, Teaser-Evidenz)
11. `docs/CONTENT.md` – Inhaltsdokumentation auf V0.2.1-Patch aktualisiert
12. `docs/TECHNICAL.md` – Technische Dokumentation von entfernten Relationstypen bereinigt

---

## 2. Detaillierte Umsetzung der Anforderungen

### 2.1 Zweistufige Fail-Closed-Validierung & Vorwärtsreferenzen
* **Phase 1 (Indizierung):** `regionMap`, `locationMap`, `sceneMap`, `hotspotMap`, `actionMap`, `itemMap`, `quizActionMap`, `bookmarkActionMap`, `routeMap`, `optionMap`, `sourceMap`, `claimMap`, `nodeMap`, `relationMap` werden vollständig aufgebaut und auf ID-Duplikate geprüft. `routeMap` ist vollständig indiziert, bevor eine einzige `NAVIGATE_ROUTES.routeId` geprüft wird.
* **Phase 2 (Konsistenzprüfung):**
  - `NAVIGATE_ROUTES.routeId` validiert gegen `routeMap`.
  - `RouteOption.bookmarkId` validiert gegen `bookmarkActionMap`.
  - `LocationNode.regionId` validiert gegen `regionMap`.
  - `Condition.targetId` typspezifisch validiert: `VISITED` ➔ `locationMap`, `ITEM_COLLECTED` ➔ `itemMap`, `QUIZ_SOLVED` ➔ `quizActionMap`.
  - Alle Verstöße führen zu `isValid === false` und `releaseStatus === 'BLOCKED_BY_VALIDATION_ERRORS'`.
* **Positivtest für Vorwärtsreferenzen:** Eine RouteOption oder Condition darf auf eine erst in einer späteren Szene registrierte Bookmark-, Quiz- oder Item-Entität verweisen und bleibt strukturell gültig (`isValid === true`).

### 2.2 Versorgungsinhalte & KBV-Ausnahmen
* `claim_care_116117_ptv11` und `docs/CONTENT.md` bilden den Wortlaut der KBV exakt ab: Mindestens 50 Minuten Sprechstunde sind grundsätzlich auch vor Probatorik oder Akutbehandlung erforderlich.
* Die beiden einzigen auf der KBV-Informationsseite genannten Ausnahmen sind präzise benannt:
  1. Vorherige stationäre Krankenhaus- oder Rehabilitationsbehandlung aufgrund einer psychischen Erkrankung mit einer ambulant psychotherapeutisch behandelbaren Diagnose.
  2. Therapeutenwechsel während einer laufenden Psychotherapie.

### 2.3 Trennung von G-BA und Goldberg 2026
* `lighthouse.ts` (`lh_wall_charts`): G-BA-Richtlinienverfahren als formaler sozialrechtlicher Erstattungsrahmen ohne vergleichende Rangfolge oder qualitative Überlegenheitsaussage.
* `workshop.ts` (`ws_collaboration_desk`): Goldberg et al. (2026) ist ausschließlich der separaten `INTEREST`-Aktion (`act_ws_interest_goldberg_fit`) zugeordnet und als begrenzter Nullbefund der 38 statischen Vorabmerkmale beschrieben.
* Das dynamische Passungsmodell („Passung entwickelt sich im Dialog“) ist eigenständig über `claim_fit_collaboration_dynamic` begründet.

### 2.4 Generisches Routing & ARIA-Grundfunktionalität
* `computeRouteNavigationEffect(option, locations, originLocationId?)` schließt den übergebenen Ausgangsort generisch aus (`loc.id !== originLocationId`).
* Für `opt_concrete_action` liefert der Aufruf mit `originLocationId: 'loc_lighthouse'` exakt `['loc_workshop']`.
* Alle Akkordeons aktualisieren beim Klick `aria-expanded` synchron mit der CSS-Sichtbarkeit und sind über `aria-controls` mit der Body-ID verknüpft.
* Das Schauplatz-Evidenzmodal besitzt `role="dialog"`, `aria-modal="true"` und `aria-labelledby="modal-title-scene-evidence"`.

---

## 3. Prüfkommandos, Exit-Codes & Bundle-Integrität

| Prüfkommando | Erwarteter Exit-Code | Tatsächlicher Exit-Code | Status / Ausgabe |
|---|---|---|---|
| `npm test` | 0 | 0 | 39 Tests in 5 Testdateien erfolgreich |
| `npm run check:technical` | 0 | 0 | TypeScript (`tsc --noEmit`) und Vitest fehlerfrei |
| `npm run build:technical` | 0 | 0 | Vite Produktionsbundle erfolgreich gebaut |
| `npm run validate:release` | 1 | 1 | Blockiert durch 8 erreichbare Drafts (0 Fehler) |
| `npm run build` | 1 | 1 | Bricht vor `vite build` beim Release-Gate ab |

### Dynamisch ermittelte erreichbare Draft-Claim-IDs:
1. `claim_gba_guidelines`
2. `claim_fit_collaboration_dynamic`
3. `claim_action_oriented_rumination`
4. `claim_evidence_perspectives`
5. `claim_therapeutic_alliance`
6. `claim_care_116117_ptv11`
7. `claim_care_funding_paths`
8. `claim_therapist_characteristics_null_finding`

### Nachweis der Unverändertheit des Produktionsbundles (`dist/`):
* **Berechnungsmethode:** SHA-256 Hash des alphabetisch sortierten SHA-256-Dateimanifests des `dist/`-Verzeichnisses.
* **Manifest-Hash vor `npm run build`:** `07836959084a3da70291e42ac456103bcd81e56eb6e5458c4f165db4c919f5f3`
* **Manifest-Hash nach fehlgeschlagenem `npm run build`:** `07836959084a3da70291e42ac456103bcd81e56eb6e5458c4f165db4c919f5f3`
* **Ergebnis:** Bytegenaue Identität (100% unverändert).

---

## 4. Testübersicht (39 Tests in 5 Suiten)

* `tests/mapGeometry.test.ts` (6 Tests): Euklidische Distanz, Pinch-Mittelpunkt, Pinch-Zoom, FitBounds, Bounding-Box Clamping.
* `tests/evidenceRenderer.test.ts` (5 Tests): Badges für SourceKinds, Badges für CitationRoles, Draft-Schutz, HTML-Card Rendering.
* `tests/storage.test.ts` (8 Tests): Schema-Migration, tiefe Validierung, korrupte Daten, Recovery-Key, In-Memory Failover, Read-Only Schutz.
* `tests/knowledgeValidation.test.ts` (17 Tests):
  1. Produktions-Wissensgraph & Release-Gate Draft-Blockierung
  2. Vorwärtsreferenzen (Positivtest)
  3. Route mit nur `need` (Abweisung)
  4. Route mit nur `working-mode` (Abweisung)
  5. Unbekannte Claims (Abweisung)
  6. `NAVIGATE_ROUTES` mit unbekannter `routeId` (Abweisung)
  7. `RouteOption.bookmarkId` mit unbekannter oder Nicht-BOOKMARK Aktion (Abweisung)
  8. Doppelte Region-IDs und unbekannte `regionId` (Abweisung)
  9. Doppelte `itemId` in `ITEM`-Aktionen (Abweisung)
  10. `Condition.targetId` nach Typ (`VISITED`, `ITEM_COLLECTED`, `QUIZ_SOLVED`) (Abweisung)
  11. Unbekannte Location `knowledgeNodeIds` (Abweisung)
  12. Doppelte Entitäts-IDs (Abweisung)
  13. Verwaiste Szenen und Locations (Abweisung)
  14. Multi-Hop BFS Reachability Draft-Blockierung
  15. Didaktische Werkstattkette ohne `evokes-need` Relation
  16. Generischer Ausschluss von `originLocationId` (Option 1 ➔ `['loc_workshop']`)
  17. Optionen 2–5: neutrale Vormerkung ohne Highlight und State-Mutation
* `tests/uiEvidence.test.ts` (3 Tests):
  1. Öffentlicher Test: Kompass-Modal `ActionModal.open()`, Klick auf Disclaimer- und Perspektiven-Akkordeon, Prüfung von `aria-expanded` und ARIA-Modal-Attributen.
  2. Öffentlicher Test: Schauplatz-Evidenz via `SceneView` Button, Prüfung von `role="dialog"`, `aria-modal="true"`, `aria-labelledby` und Akkordeon-Bedienbarkeit.
  3. Öffentlicher Test: Teaser-Evidenz via `renderTeaserCardHtml()`, Klick auf Akkordeon, Prüfung der aufgelösten Knowledge-Node-Claims.

---

## 5. Abweichungen vom Plan
* Keine Abweichungen. Alle Vorgaben aus dem freigegebenen Plan `6d6e96c` und die drei zusätzlichen Ausführungsdetails wurden vollständig und exakt umgesetzt.
