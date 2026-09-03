# Technische Dokumentation: Psychotherapie-Landkarte (V0.2.1)

## 1. Übersicht & Technologie-Stack

Die **Psychotherapie-Landkarte** ist als erweiterbare, interaktive Wissenswelt im Browser aufgebaut. Die Architektur trennt strikt zwischen visueller Rendering-Engine (PixiJS), barrierearmem UI/Interaktionslayer (HTML/CSS mit ARIA-Grundfunktionalität), didaktischer Navigation (Exploration), einer formalen wissenschaftlichen Wissensontologie, reiner Geometrieberechnung und dem reaktiven Nutzerspeicher.

* **Bundler & Build:** Vite 6 + TypeScript 5
* **Release-Governance:** TypeScript-basiertes Release-Gate via `tsx scripts/validateRelease.ts`
* **Testrunner & Validierung:** Vitest 3 (`npm test`, `npm run check:technical`)
* **2D-Karten-Engine:** PixiJS v8 (`Application`, `Container`, `Sprite`, `Assets`, `FederatedPointerEvent` mit `pointerupoutside`/`pointercancel`, reine Geometrie-Extraktion in `src/engine/mapGeometry.ts`)
* **UI & Dialogsystem:** Vanilla HTML5 / CSS3 mit CSS Custom Properties (Kartografisches Theme, getrennte Badges für `SourceKind` und `CitationRole`, Draft-Schutz, ARIA-Attribute)
* **Zustandsverwaltung & Persistenz:** Reaktiver `AppStore` mit `localStorage`-Adapter, Schema-Versionierung (`schemaVersion: 1`), Failover-In-Memory-Modus bei Backup-Fehlern und JSON-Export/Import (`exporter.ts`).

---

## 2. Projektstruktur

```
landkarte-der-psychotherapie/
├── index.html                 # App-Shell mit Meta-Tags & Styles
├── package.json               # Abhängigkeiten, Scripts (check, build:technical, validate:release, build)
├── package-lock.json          # Lockfile mit tsx & happy-dom
├── tsconfig.json              # TypeScript-Konfiguration
├── vite.config.ts             # Vite- & Vitest-Konfiguration (happy-dom)
├── scripts/
│   └── validateRelease.ts     # TypeScript Release-Gate mit BFS-Reachability-Check
├── public/
│   └── assets/
│       ├── map/               # Raster-Basiskarten (z. B. central_region.jpg)
│       └── scenes/            # Szenenbilder (lighthouse.jpg, station.jpg, workshop.svg)
├── src/
│   ├── main.ts                # Bootstrapping, generisches Routing, Teaser-Renderer
│   ├── types/                 # Strikte TypeScript-Typdefinitionen
│   │   ├── content.ts         # KnowledgeNode, ClaimRecord, SourceRecord, ExplorationRoute
│   │   ├── world.ts           # WorldMapData, LocationNode, Region
│   │   ├── scene.ts           # Scene, Hotspot, HotspotAction (Discriminated Union), Condition
│   │   ├── inventory.ts       # ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry
│   │   └── state.ts           # UserState, SchemaVersion, StateListener
│   ├── data/
│   │   ├── knowledge/         # Wissenschaftliche Ontologie
│   │   │   ├── sources.ts     # G-BA (BAnz B3), KBV, SGB V, Goldberg 2026, Grawe 1997
│   │   │   ├── claims.ts      # Fachliche Aussagen, Goldberg Nullbefund, SGB V Alternativen
│   │   │   ├── nodes.ts       # Experience, Need, Working-Mode, Process, Intervention, Approach, Care, Collaboration
│   │   │   ├── relations.ts   # acts-via, realized-by, implements, belongs-to, examines-fit, explores-aspect
│   │   │   └── index.ts       # Wissens-Registry & typsichere Getter
│   │   ├── exploration/       # Didaktische Kompassnavigation
│   │   │   ├── routes.ts      # 5 schulenübergreifende Arbeitsweisen (Target: need + working-mode)
│   │   │   └── index.ts       # Route-Registry & getExplorationRouteById()
│   │   ├── worldData.ts       # Zentralregion-Landmarken mit kanonischen knowledgeNodeIds
│   │   ├── onboarding.ts      # 3-Punkte Intro-Text
│   │   └── scenes/
│   │       ├── lighthouse.ts  # Szene A: Leuchtturm der Evidenz (Kompass-Hotspot)
│   │       ├── station.ts     # Szene B: Bahnhof der Versorgung (node_care_consultation_116117)
│   │       ├── workshop.ts    # Szene C: Werkstatt der Erprobung (Kompass-Ziel)
│   │       └── index.ts       # Szenen-Registry
│   ├── validation/
│   │   └── validateKnowledge.ts # Zweistufige Fail-Closed-Validierung, BFS-Reachability-Traversal
│   ├── state/                 # Zustandsmanagement
│   │   ├── store.ts           # Reaktiver Store (Observer-Pattern)
│   │   ├── storage.ts         # Tiefe Validierung, Recovery-Key, Failover-Schutz vor Überschreiben
│   │   └── exporter.ts        # JSON-Export und Import von Spielständen
│   ├── engine/                # PixiJS 2D Karten-Engine & Geometrie
│   │   ├── MapEngine.ts       # Viewport, Zoom, Pan, Highlights
│   │   ├── LandmarkSprite.ts  # Interaktive Marker & Pins
│   │   └── mapGeometry.ts     # Reine Geometriefunktionen
│   ├── ui/                    # Benutzeroberfläche & HUD
│   │   ├── ActionModal.ts     # Hotspot-Interaktionsmodal, ARIA-Akkordeons, Schauplatz-Evidenz
│   │   ├── SceneView.ts       # Szenenansicht mit Hotspot-Layer & Evidenz-Button
│   │   ├── BackpackPanel.ts   # Rucksack (Artefakte, Interessen, Notizen, Lesezeichen)
│   │   ├── SettingsModal.ts   # Einstellungen & Spielstand-Verwaltung
│   │   ├── IntroScreen.ts     # Onboarding-Overlay
│   │   ├── Toast.ts           # Benachrichtigungstoasts
│   │   └── renderers/
│   │       └── evidenceRenderer.ts # Claim-Karten mit Evidenzlevel & Quellennachweisen
│   └── styles/                # CSS Module & Themes
├── tests/                     # Automatisierte Vitest Test-Suiten
│   ├── fixtures/
│   │   └── knowledgeFixtures.ts # Isolierter Deep-Clone-Fixture-Builder
│   ├── evidenceRenderer.test.ts # Rendering-Tests für Evidenz-Badges & HTML
│   ├── knowledgeValidation.test.ts # Ontologie-, Negativ-, BFS- & Routing-Tests
│   ├── mapGeometry.test.ts    # Geometrie- & Viewport-Tests
│   ├── storage.test.ts        # Storage-Hardening, Schema- & Recovery-Tests
│   └── uiEvidence.test.ts     # Öffentliche UI-Interaktionstests für Evidenzanzeige
└── docs/                      # Dokumentation & Audit-Pläne
    ├── CONTENT.md             # Fachliche Inhalte & Kompassrichtungen (V0.2.1)
    ├── TECHNICAL.md           # Technische Architektur & Datenstrukturen
    ├── CORRECTION_PLAN_V02_AUDIT_ROUND2.md # Verbindlicher Korrekturplan Runde 2
    └── IMPLEMENTATION_REPORT_V02_AUDIT_ROUND2.md # Abschlussbericht
```

---

## 3. Skripte & Release-Gate-Hierarchie

Zur Trennung von reiner technischer Prüfbarkeit und inhaltlicher Release-Freigabe sind die npm-Skripte hierarchisch gegliedert:

1. **`npm test` (`vitest run`):**
   Führt alle 39 Unit- und Integrationstests (Storage, Geometrie, Evidenz-Rendering, Ontologie, negative DI und UI-Interaktionstests) aus. Erwarteter Exit-Code: `0`.
2. **`npm run check:technical` (`tsc --noEmit && vitest run`):**
   Kombiniert strikte statische Typüberprüfung des gesamten Projekts mit dem Vitest-Testlauf. Erwarteter Exit-Code: `0`.
3. **`npm run build:technical` (`tsc && vite build`):**
   Erzeugt das kompilierte Produktions-Bundle im Verzeichnis `dist/`, ohne eine inhaltliche Freigabeprüfung der wissenschaftlichen Zitate durchzuführen. Dient der rein technischen Validierung des Bundlers. Erwarteter Exit-Code: `0`.
4. **`npm run validate:release` (`tsx scripts/validateRelease.ts`):**
   Führt die zweistufige Fail-Closed-Validierung und den BFS-Reachability-Traversal über den Wissensgraphen aus. Bricht mit Exit-Code `1` (`BLOCKED_BY_DRAFT_CONTENT`) ab, solange erreichbare Fach-Claims noch den Status `'draft'` tragen.
5. **`npm run build` (`tsc && vitest run && tsx scripts/validateRelease.ts && vite build`):**
   Der vollständige Release-Gate-Build. Führt Typenprüfung, Test-Suite und Release-Validierung sequentiell aus. Da `validateRelease.ts` vor `vite build` geschaltet ist, bricht der Build bei vorhandenen Draft-Inhalten mit Exit-Code `1` ab, bevor das Produktions-Bundle erzeugt oder überschrieben werden kann.
