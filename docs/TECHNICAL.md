# Technische Dokumentation: Psychotherapie-Landkarte (V0.2)

## 1. Übersicht & Technologie-Stack

Die **Psychotherapie-Landkarte** ist als erweiterbare, spielbare Wissenswelt im Browser aufgebaut. Die Architektur trennt strikt zwischen visueller Rendering-Engine (PixiJS), barrierefreiem UI/Interaktionslayer (HTML/CSS), didaktischer Navigation (Exploration), einer formalen wissenschaftlichen Wissensontologie und dem reaktiven Nutzerspeicher.

* **Bundler & Build:** Vite 6 + TypeScript 5
* **Testrunner & Validierung:** Vitest 3 (`npm test`, `npm run test:knowledge`)
* **2D-Karten-Engine:** PixiJS v8 (`Application`, `Container`, `Sprite`, `Assets`, Multi-Touch Pinch-to-Zoom mit Pointer-Capture)
* **UI & Dialogsystem:** Vanilla HTML5 / CSS3 mit CSS Custom Properties (Warmes kartografisches Theme)
* **Zustandsverwaltung & Persistenz:** Reaktiver `AppStore` mit `localStorage`-Adapter, Schema-Versionierung (`schemaVersion: 1`), Recovery-Backups bei Beschädigung und JSON-Export/Import.

---

## 2. Projektstruktur

```
landkarte-der-psychotherapie/
├── index.html                 # App-Shell mit Meta-Tags & Styles
├── package.json               # Abhängigkeiten, Scripts & Vitest
├── tsconfig.json              # TypeScript-Konfiguration
├── vite.config.ts             # Vite-Konfiguration
├── public/
│   └── assets/
│       ├── map/               # Raster-Basiskarten (z. B. central_region.jpg)
│       └── scenes/            # Szenenbilder (lighthouse.jpg, station.jpg, workshop.svg)
├── src/
│   ├── main.ts                # Bootstrapping, Multi-Location Highlighting, Routing
│   ├── types/                 # Strikte TypeScript-Typdefinitionen
│   │   ├── content.ts         # KnowledgeNode, ClaimRecord, SourceRecord, ExplorationRoute
│   │   ├── world.ts           # WorldMapData, LocationNode, Region
│   │   ├── scene.ts           # Scene, Hotspot, HotspotAction (Discriminated Union)
│   │   ├── inventory.ts       # ArtifactEntry, InterestEntry, AboutMeEntry, BookmarkEntry
│   │   └── state.ts           # UserState, SchemaVersion, StateListener
│   ├── data/
│   │   ├── knowledge/         # Wissenschaftliche Ontologie
│   │   │   ├── sources.ts     # Primärstudien, Reviews, G-BA, Versorgungsdaten
│   │   │   ├── claims.ts      # Fachliche Aussagen & Evidenzlevel
│   │   │   ├── nodes.ts       # KnowledgeNodes (experience, working-mode, intervention, etc.)
│   │   │   ├── relations.ts   # Spezifische Relationen (implements, acts-via, belongs-to, etc.)
│   │   │   └── index.ts       # Wissens-Registry & Getter
│   │   ├── exploration/       # Didaktische Kompassnavigation
│   │   │   ├── routes.ts      # 5 schulenübergreifende Arbeitsweisen
│   │   │   └── index.ts       # Route-Registry & getExplorationRouteById()
│   │   ├── worldData.ts       # Zentralregion-Landmarken mit kanonischen knowledgeNodeIds
│   │   ├── onboarding.ts      # 3-Punkte Intro-Text
│   │   └── scenes/
│   │       ├── lighthouse.ts  # Szene A: Leuchtturm der Evidenz (inkl. Kompass-Hotspot)
│   │       ├── station.ts     # Szene B: Bahnhof der Versorgung
│   │       ├── workshop.ts    # Szene C: Werkstatt der Erprobung (Kompass-Ziel)
│   │       └── index.ts       # Szenen-Registry
│   ├── validation/
│   │   └── validateKnowledge.ts # Build- & CI-Validierungs-Pipeline
│   ├── state/                 # Zustandsmanagement
│   │   ├── store.ts           # Reaktiver Store (Observer-Pattern)
│   │   ├── storage.ts         # Härtung mit Recovery-Backups & strict JSON parsing
│   │   └── exporter.ts        # JSON Download / Upload
│   ├── engine/                # PixiJS Canvas-Weltkarte
│   │   ├── MapEngine.ts       # Pan, Zoom, fitLocations, Touch Pinch Gesten
│   │   └── LandmarkSprite.ts  # Interaktive Pins mit Highlight-Glow & Puls
│   ├── ui/                    # UI-Overlays & Interaktionen
│   │   ├── SceneView.ts       # Point-and-Click Szenen-Renderer
│   │   ├── ActionModal.ts     # Dialoge mit Quellen-Akkordeon & Kompass-Routen
│   │   ├── BackpackPanel.ts   # 3-Säulen Rucksack ("Auf einen Blick")
│   │   ├── SettingsModal.ts   # JSON Export/Import & Reset
│   │   └── Toast.ts           # Visuelles Feedback
│   └── styles/
│       ├── main.css           # Tokens, Header, Breadcrumbs
│       ├── map.css            # Canvas-Layout, Controls, Route-Banner
│       ├── scenes.css         # Szenen-Container, relative Hotspots
│       ├── backpack.css       # 3-Spalten Layout
│       └── dialogue.css       # Dialoge, Quellen-Badges, Evidenz-Tags
├── tests/
│   ├── knowledgeValidation.test.ts # Integritätstests Ontologie
│   └── storage.test.ts        # Persistenz- & Recovery-Tests
└── docs/
    ├── IMPLEMENTATION_PLAN_KNOWLEDGE_GRAPH.md # Plan V2.1
    ├── IMPLEMENTATION_REPORT_KNOWLEDGE_GRAPH.md # Abschlussbericht
    ├── TECHNICAL.md           # Diese Dokumentation
    ├── CONTENT.md             # Didaktik & Evidenzstufen
    └── VISUAL_BIBLE.md        # Styleguide
```

---

## 3. Schichtentrennung & Referenzhoheit

1. **Wissensontologie (`src/data/knowledge/`):**
   * Reine Fachbegriffe und wissenschaftliche Befunde.
   * `KnowledgeNode` enthält **keine** geografischen IDs (Locations oder Szenen).
2. **Didaktische Exploration (`src/data/exploration/`):**
   * Pfade und Optionen beschreiben Arbeitsweisen und verweisen über `targetKnowledgeNodeIds` auf Fachknoten.
3. **Kartengeografie (`src/data/worldData.ts`):**
   * `LocationNode.knowledgeNodeIds` ist die kanonische Verknüpfung von Schauplätzen mit Fachknoten.
4. **Nutzerspeicher (`src/state/`):**
   * Speichert ausschließlich explizite Aktionen in `schemaVersion: 1`.
   * Kartenmarkierungen und Kameraschwenks sind flüchtiger UI-Zustand.

---

## 4. Multi-Touch Pinch-to-Zoom

In `MapEngine.ts` werden Multi-Touch-Gesten über die Pointer-Events von PixiJS v8 verarbeitet:
* `pointerdown`, `pointermove`, `pointerup`, `pointercancel` mit Pointer-Cache für 2 gleichzeitige Berührungspunkte.
* Zoomfaktor wird über den euklidischen Abstand berechnet; Skalierung erfolgt zentriert um den Mittelpunkt zwischen beiden Fingern.
* `canvas.style.touchAction = 'none'` verhindert Browser-Scroll-Konflikte auf Tablets.
