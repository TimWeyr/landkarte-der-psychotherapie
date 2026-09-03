# Abschlussbericht: Audit-Korrekturen V0.2.1

**Projekt:** Psychotherapie-Landkarte (Zentralregion)  
**Basis-Commit:** `c5dcd93`  
**Code-Commit (SHA):** `99760e9`  
**Report-Commit (SHA):** [wird beim Commit erzeugt]  
**Datum:** 03. September 2026  
**Status:** Audit-Korrekturen implementiert und verifiziert

---

## 1. Übersicht der geänderten Dateien

Die folgenden 15 Dateien wurden im Code-Commit `99760e9` modifiziert:

1. `package.json` – `happy-dom` Test-Umgebung hinzugefügt
2. `package-lock.json` – Lockfile synchronisiert
3. `vite.config.ts` – Vitest happy-dom Konfiguration
4. `src/types/content.ts` – Dokumentierte Richtungssemantik der Relationen (`acts-via`, `realized-by`, `implements`, `belongs-to`, `examines-fit`)
5. `src/data/knowledge/claims.ts` – Rechtliche Präzisierungen (§ 13 Abs. 3 SGB V, G-BA vs. empirische Evidenz, KBV-Ausnahmen bei Sprechstunde, Erkundungsmodelle)
6. `src/data/knowledge/relations.ts` – Entfernung automatischer `evokes-need` und `addresses-need` Relationen
7. `src/data/scenes/workshop.ts` – Integration des Goldberg 2026 Claims (`claim_therapist_characteristics_null_finding`) in Hotspot-Dialog und Aktionen
8. `src/main.ts` – Routing-Controller mit `computeRouteNavigationEffect()`, Teaser-Akkordeon-Aktivierung und Schauplatz-Übergabe an SceneView
9. `src/ui/ActionModal.ts` – Perspektiven-Akkordeons für alle RouteOptions, Schauplatz-Evidenzansicht und kollisionsfreie lokale Akkordeon-Handler
10. `src/ui/SceneView.ts` – Schauplatz-Evidenz-Button (`openSceneEvidenceModal`)
11. `src/ui/Toast.ts` – Sichere Kapselung bei serverseitiger oder isolierter Ausführung
12. `src/validation/validateKnowledge.ts` – Zyklensicherer BFS-Reachability-Traversal und lückenlose Fail-Closed-Validierung aller Referenzen
13. `tests/fixtures/knowledgeFixtures.ts` – Vollständig isolierter Deep-Clone-Builder ohne unbemerkte Produktions-Fallbacks
14. `tests/knowledgeValidation.test.ts` – 12 umfassende Integritäts-, Negativ- und UI-Interaktionstests
15. `docs/CONTENT.md` – Inhalts- und Evidenzdokumentation auf V0.2.1 aktualisiert

---

## 2. Detaillierte Umsetzung der Audit-Anforderungen

### 2.1 Entfernung impliziter Bedürfnisableitungen
* `rel_rumination_evokes_coping` und `rel_need_addresses_action` wurden gelöscht.
* Die Verbindung `experience → need + working-mode` entsteht ausschließlich durch die bewusste didaktische Auswahl einer `RouteOption`.
* Die Werkstattkette verläuft wie folgt:
  `Route.triggerNodeId` ➔ `RouteOption` ➔ `need + working-mode`
  und separat in der Wissensontologie:
  `working-mode` ➔ `process` (`acts-via`) ➔ `intervention` (`realized-by`) ➔ `approach` (`belongs-to`)
  sowie `working-mode` ➔ `collaboration (Passungsprüfung)` (`examines-fit`) ➔ `collaboration (Allianz)` (`examines-fit`).

### 2.2 Echter Reachability-Traversal (BFS)
* `getReachableClaimIds()` nutzt eine zyklensichere Breadth-First-Search mit expliziter Queue und `visitedNodeIds`.
* Wurzelknoten sind die über erreichbare Locations, Szenen und Routen referenzierten Knoten.
* Bei jeder traversierten gerichteten Relation (`fromNodeId -> toNodeId`) werden `relation.claimIds`, der Zielknoten und `targetNode.claimIds` erfasst.
* Multi-Hop-Verifikation: Ein Negativtest stellt sicher, dass ein Draft-Claim hinter zwei oder mehr Relationsschritten das Release zuverlässig blockiert.

### 2.3 Fail-Closed-Validierung aller Referenzen
Folgende Entitäts- und Referenzintegritäten werden strikt geprüft:
* `Route.disclaimerClaimIds` und `RouteOption.perspectiveClaimIds`
* `RouteOption.targetKnowledgeNodeIds` (mindestens 1 `need`- und 1 `working-mode`-Knoten; kein `approach`-Knoten)
* `LocationNode.teaserClaimIds` und `LocationNode.knowledgeNodeIds`
* Dialog-, Subtext-, Action-, Quiz- und Item-Claims
* Node- und Relations-Claims
* Bidirektionale Scene ↔ Location Konsistenz (keine verwaisten Szenen, keine verwaisten Schauplatz-Szenen)
* Eindeutigkeit sämtlicher IDs (Quellen, Claims, Knoten, Relationen, Routen, Optionen, Locations, Szenen, Hotspots, Actions).
* Fehlende Referenzen führen ausnahmslos zu `BLOCKED_BY_VALIDATION_ERRORS`.

### 2.4 Voll funktionsfähige Evidenzanzeige
* Jede `RouteOption` zeigt ein ausklappbares Akkordeon für ihre `perspectiveClaimIds`.
* Disclaimer- und Teaser-Akkordeons sind per Klick aufklappbar.
* Jeder Schauplatz bietet über einen Button (`📚 Schauplatz-Evidenz`) eine generische, barrierefreie Übersicht aller zugeordneten Fachknoten und Nachweise.
* Der Goldberg 2026 Claim (`claim_therapist_characteristics_null_finding`) ist über das Notizbuch der Zusammenarbeit in der Werkstatt (`scene_workshop`) als Reflexionsaktion interaktiv erreichbar.
* Keine ID-Kollisionen im DOM; alle Event-Handler sind lokal gekapselt.
* Draft-Claims zeigen weiterhin das Schutzbadge `[Entwurf: Zitatprüfung ausstehend]` und niemals „Gut belegt“.

---

## 3. Prüfkommandos und Exit-Codes

| Prüfkommando | Erwarteter Exit-Code | Tatsächlicher Exit-Code | Status / Ausgabe |
|---|---|---|---|
| `npm test` | 0 | 0 | 31 Tests in 4 Testdateien erfolgreich |
| `npm run check:technical` | 0 | 0 | TypeScript (`tsc --noEmit`) und Vitest fehlerfrei |
| `npm run build:technical` | 0 | 0 | Vite Produktionsbundle erfolgreich gebaut |
| `npm run validate:release` | 1 | 1 | Blockiert durch 8 erreichbare Drafts |
| `npm run build` | 1 | 1 | Bricht vor `vite build` beim Release-Gate ab |

### Dynamisch ermittelte erreichbare Draft-Claim-IDs:
1. `claim_gba_guidelines`
2. `claim_evidence_perspectives`
3. `claim_action_oriented_rumination`
4. `claim_fit_collaboration_dynamic`
5. `claim_therapeutic_alliance`
6. `claim_care_116117_ptv11`
7. `claim_care_funding_paths`
8. `claim_therapist_characteristics_null_finding`

---

## 4. Testübersicht (31 Tests)

* `tests/evidenceRenderer.test.ts` (5 Tests): Badges für alle `SourceKind`- und `CitationRole`-Werte, Draft-Schutz, HTML-Card-Rendering.
* `tests/mapGeometry.test.ts` (6 Tests): Euklidische Distanz, Pinch-Mittelpunkt, Pinch-Skalierung, FitBounds (Single/Multi-Point), Bounding-Box Clamping.
* `tests/storage.test.ts` (8 Tests): Tiefe Validierung, Schema-Versionierung, korrupte Daten, Recovery-Backup, In-Memory-Failover bei fehlerhaftem Backup, unberührter Store bei fehlerhaftem Import.
* `tests/knowledgeValidation.test.ts` (12 Tests):
  1. Produktions-Wissensgraph & Draft-Blockierung
  2. Route mit nur `need` (Abweisung)
  3. Route mit nur `working-mode` (Abweisung)
  4. Unbekannte Disclaimer-, Perspektiven-, Teaser-, Dialog-, Quiz- und Item-Claims (Abweisung)
  5. Unbekannte Location-KnowledgeNode-ID (Abweisung)
  6. Doppelte Relation-, Route-, Location- und Hotspot-IDs (Abweisung)
  7. Verwaiste Szenen und Schauplätze (Abweisung)
  8. Multi-Hop BFS Reachability bei Draft-Claims (Blockierung)
  9. Vollständige Route-basierte Werkstattkette ohne implizite Bedürfnisrelation
  10. Optionen 2–5: neutrale Perspektive, kein Highlight, keine State-Mutation im Routing-Controller
  11. Option 1: Werkstatt-Highlight ohne State-Mutation
  12. Funktionale Teaser-, Disclaimer- und Perspektiven-Akkordeons mit DOM-Interaktion.

---

## 5. Abweichungen und Feststellungen
* Es existieren keine ungeprüften Entwürfe mit vorzeitiger Freigabe.
* Das Verhalten des Release-Gates verhindert zuverlässig jede Erzeugung eines Produktions-Releases, solange offene Drafts im erreichbaren Wissensgraphen vorhanden sind.
