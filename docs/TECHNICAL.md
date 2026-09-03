# Technische Dokumentation: Psychotherapie-Landkarte (V0.2.1)

## 1. Übersicht & Technologie-Stack

Die **Psychotherapie-Landkarte** ist als erweiterbare, spielbare Wissenswelt im Browser aufgebaut. Die Architektur trennt strikt zwischen visueller Rendering-Engine (PixiJS), barrierefreiem UI/Interaktionslayer (HTML/CSS), didaktischer Navigation (Exploration), einer formalen wissenschaftlichen Wissensontologie, reiner Geometrieberechnung und dem reaktiven Nutzerspeicher.

* **Bundler & Build:** Vite 6 + TypeScript 5
* **Release-Governance:** TypeScript-basiertes Release-Gate via `tsx scripts/validateRelease.ts`
* **Testrunner & Validierung:** Vitest 3 (`npm test`, `npm run check:technical`)
* **2D-Karten-Engine:** PixiJS v8 (`Application`, `Container`, `Sprite`, `Assets`, `FederatedPointerEvent` mit `pointerupoutside`/`pointercancel`, reine Geometrie-Extraktion in `src/engine/mapGeometry.ts`)
* **UI & Dialogsystem:** Vanilla HTML5 / CSS3 mit CSS Custom Properties (Kartografisches Theme, getrennte Badges für `SourceKind` und `CitationRole`, Draft-Schutz)
* **Zustandsverwaltung & Persistenz:** Reaktiver `AppStore` mit `localStorage`-Adapter, Schema-Versionierung (`schemaVersion: 1`), Failover-In-Memory-Modus bei Backup-Fehlern und JSON-Export/Import.

---

## 2. Projektstruktur

```
landkarte-der-psychotherapie/
├── index.html                 # App-Shell mit Meta-Tags & Styles
├── package.json               # Abhängigkeiten, Scripts (check, build:technical, validate:release, build)
├── package-lock.json          # Lockfile mit tsx
├── tsconfig.json              # TypeScript-Konfiguration
├── vite.config.ts             # Vite-Konfiguration
├── scripts/
│   └── validateRelease.ts     # TypeScript Release-Gate mit Reachability-Check
├── public/
│   └── assets/
│       ├── map/               # Raster-Basiskarten (z. B. central_region.jpg)
│       └── scenes/            # Szenenbilder (lighthouse.jpg, station.jpg, workshop.svg)
├── src/
│   ├── main.ts                # Bootstrapping, Routing, neutrale Banner
│   ├── types/                 # Strikte TypeScript-Typdefinitionen
│   │   ├── content.ts         # KnowledgeNode, ClaimRecord, SourceRecord, ExplorationRoute
│   │   ├── world.ts           # WorldMapData, LocationNode, Region
│   │   ├── scene.ts           # Scene, Hotspot, HotspotAction (Discriminated Union)
│   │   ├── inventory.ts       # ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry
│   │   └── state.ts           # UserState, SchemaVersion, StateListener
│   ├── data/
│   │   ├── knowledge/         # Wissenschaftliche Ontologie
│   │   │   ├── sources.ts     # G-BA (BAnz B3), KBV, SGB V, Goldberg 2026, Grawe 1997
│   │   │   ├── claims.ts      # Fachliche Aussagen, Goldberg Nullbefund, SGB V Alternativen
│   │   │   ├── nodes.ts       # Experience, Need, Working-Mode, Process, Intervention, Approach, Care, Collaboration
│   │   │   ├── relations.ts   # evokes-need, addresses-need, acts-via, realized-by, belongs-to, examines-fit
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
│   │   └── validateKnowledge.ts # Vollständige DI-Unterstützung, Reachability-Traversal, 13 Regeln
│   ├── state/                 # Zustandsmanagement
│   │   ├── store.ts           # Reaktiver Store (Observer-Pattern)
│   │   ├── storage.ts         # Tiefe Validierung, Recovery-Key, Failover-Schutz vor Überschreiben
│   │   └── exporter.ts        # JSON Download / Upload
│   ├── engine/                # PixiJS Canvas-Weltkarte & Geometrie
│   │   ├── mapGeometry.ts     # Reine Geometriefunktionen (Pinch, FitBounds, Clamping)
│   │   ├── MapEngine.ts       # Pan, Zoom, fitLocations, Touch Gesten
│   │   └── LandmarkSprite.ts  # Interaktive Pins (drag-toleranter pointerup, kein pointertap)
│   ├── ui/                    # UI-Overlays & Interaktionen
│   │   ├── renderers/
│   │   │   └── evidenceRenderer.ts # Reine HTML-Renderer für Badges & Draft-Schutz
│   │   ├── SceneView.ts       # Point-and-Click Szenen-Renderer (no-any)
│   │   ├── ActionModal.ts     # Dialoge mit Quellen-Akkordeon & Reachability aller Claims
│   │   ├── BackpackPanel.ts   # 3-Säulen Rucksack ("Auf einen Blick")
│   │   ├── SettingsModal.ts   # JSON Export/Import & Reset
│   │   └── Toast.ts           # Visuelles Feedback
│   └── styles/
│       ├── main.css           # Tokens, Header, Breadcrumbs
│       ├── map.css            # Canvas-Layout, Controls, Route-Banner
│       ├── scenes.css         # Szenen-Container, relative Hotspots
│       ├── backpack.css       # 3-Spalten Layout
│       └── dialogue.css       # Dialoge, SourceKind-Badges, CitationRole-Badges
├── tests/
│   ├── fixtures/
│   │   └── knowledgeFixtures.ts # Benannter Fixture-Builder für isolierte Negativtests
│   ├── knowledgeValidation.test.ts # 13 Integritäts- und Negativtests
│   ├── storage.test.ts        # Tiefe Validierungs- & Failover-Tests
│   ├── mapGeometry.test.ts    # Geometrie- & Pinch-Tests
│   └── evidenceRenderer.test.ts # UI-Renderer & Draft-Schutz Tests
└── docs/
    ├── CORRECTION_PLAN_V02_AUDIT.md # Freigegebener Korrekturplan V2.1
    ├── IMPLEMENTATION_REPORT_V02_AUDIT_FIXES.md # Abschlussbericht
    ├── TECHNICAL.md           # Diese Dokumentation
    ├── CONTENT.md             # Didaktik & Evidenzstufen
    └── VISUAL_BIBLE.md        # Styleguide
```

---

## 3. Script-Hierarchie & Release-Gate

* `npm run check:technical`: Führt `tsc --noEmit` und `vitest run` aus.
* `npm run build:technical`: Führt `tsc && vite build` aus (für Entwicklungs- und Preview-Zwecke).
* `npm run validate:release`: Führt den formalen Reachability-Check aus (`tsx scripts/validateRelease.ts`). Bricht mit Exit 1 ab, solange erreichbare Claims `draft` sind.
* `npm run build`: Vollständige Release-Pipeline (`tsc && vitest run && tsx scripts/validateRelease.ts && vite build`).
