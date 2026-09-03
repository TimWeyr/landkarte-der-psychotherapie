# Visual Bible & Styleguide: Psychotherapie-Landkarte

## 1. Visuelle Identität

Die visuelle Welt der Psychotherapie-Landkarte verbindet das Gefühl eines **illustrierten Reiseatlasses** mit der Klarheit eines modernen Web-Interfaces:

* **Stimmung:** Warm, einladend, entschleunigt, geerdet.
* **Kein steriler Medizin-Look:** Keine weißen Kachel-Layouts, keine generischen Stockfotos von Stethoskopen oder Sprechzimmern.
* **Kein generischer AI-Look:** Keine grellen Neonfarben, kein Sci-Fi-/Cyberpunk-Glow, keine hyperrealistischen 3D-Shader.
* **Materialität:** Gedrucktes Büttenpapier, Kupferstich-/Linolschnitt-Anmutung, Pergament, warmes Holz, patiniertes Messing.

---

## 2. Farbpalette (Design Tokens)

| Token | Hex | Verwendung |
|---|---|---|
| `--bg-parchment` | `#f6f1e8` | Haupt-Hintergrund & Canvas-Träger |
| `--bg-parchment-deep` | `#ede4d3` | Header, Modalböden, Akzentflächen |
| `--bg-card` | `#fffdf8` | Inhaltskarten, Rucksack-Panels |
| `--ink-primary` | `#2d261e` | Überschriften, Primärtexte |
| `--ink-secondary` | `#5a5043` | Fließtexte, Beschreibungen |
| `--ink-muted` | `#877a6a` | Subtexte, Fußnoten, Metadaten |
| `--accent-gold` | `#c68a35` | Interaktive Pins, Primärbuttons, Fundstücke |
| `--accent-sage` | `#50755a` | „Das interessiert mich“, Natur- & Wissensakzente |
| `--accent-terracotta` | `#b25838` | „Über mich“, Rucksack-Badges, Warnungen |
| `--accent-slate` | `#446473` | „Für später merken“, Lesezeichen, Ozean |

---

## 3. Kompositions- & Perspektiven-Regeln

### 3.1 Hauptkarte (World Map)
* **Perspektive:** 2.5D top-down / sanfte Schrägansicht (ca. 45° bis 60° Neigungswinkel).
* **Auflösung:** 1792 × 1024 Pixel (Seitenverhältnis ca. 16:9).
* **Struktur:** Fließende Landschaft mit natürlichen Pfaden, Flüssen, Küstenlinien und sichtbaren Erhebungen, die Orientierungsachsen bilden.
* **Layering:** Das Landschaftsbild ist ein **reiner Raster-Hintergrund**; alle interaktiven Gebäude, Marker und Hoverflächen werden dynamisch als separate Vektor-/Pixi-Layer darüber gerendert.

### 3.2 Szenen (Point-and-Click)
* **Perspektive:** 2D-Innenansicht oder leicht erhöhte Schrägansicht (Augenhöhe), die klare räumliche Tiefe vermittelt.
* **Auflösung:** 1920 × 1080 Pixel (16:9).
* **Hotspot-Verteilung:** Maximal 4–6 markante Schwerpunkte pro Szene, harmonisch über das Bild verteilt (z. B. 1 Fokus links, 2 Mitte, 1 rechts), um Überfrachtung zu vermeiden.

---

## 4. Prompting-Formel für zukünftige Regionen (AI Generation)

Verwende für neue Szenen und Regionen immer diesen Prompt-Rahmen, um visuelle Konsistenz zu wahren:

```text
Storybook illustrated point-and-click adventure game scene of [MOTIV].
Warm cozy atmosphere with [SPECIFIC OBJECTS: e.g. wooden desk, vintage books, warm lantern],
painterly linocut and watercolor style matching a vintage explorer map,
warm earthy color palette with ochre (#c68a35), sage green (#50755a), terracotta (#b25838), and slate blue,
soft sunlight and gentle shadows, clean composition with distinct focal points of interest,
inviting scholarly atmosphere, no modern digital screens, no UI overlays, 16:9 aspect ratio.
```
