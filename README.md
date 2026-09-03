# 🗺️ Landkarte der Psychotherapie

Eine interaktive, spielbare Browser-Wissenswelt zur Orientierung in der Psychotherapielandschaft.

## 🌟 Projektidee & Leitprinzipien

* **Kein Test, kein Scoring, keine Diagnose:** Die Anwendung berechnet keine passenden Therapien und stellt keine Diagnosen.
* **Schulenübergreifend & Integrativ:** Zeigt reale therapeutische Arbeitsweisen auf, ohne starre 1:1-Schubladen zu bedienen.
* **Freie Erkundung:** Eine handgezeichnete, erkundbare Landkarte mit Point-and-Click-Szenen und interaktiven Schauplätzen.
* **Wissenschaftliche Transparenz:** Strikte Trennung von empirischer Evidenz, theoretischen Modellen, Versorgungsregeln und Patientennarrativen.
* **Persönlicher Rucksack:** Sammeln von Interessen, Notizen und konkreten Vorbereitungsfragen für Erstgespräche.

---

## 🚀 Technologie-Stack

* **Frontend:** Vite 6 + TypeScript 5 + HTML5 / CSS3
* **2D-Map Engine:** PixiJS v8 (Pan, Zoom, Multi-Touch Pinch-to-Zoom, Landmarken-Highlighting)
* **Wissensontologie:** Deklaratives Graphmodell für Quellen, Claims, Wissensknoten und Relationen
* **State Management:** Reaktiver Observer-Store mit `localStorage`-Persistenz (`schemaVersion: 1`), Recovery-Backups und JSON-Export/Import
* **Testing:** Vitest 3

---

## 🛠️ Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Testsuite ausführen
npm test

# Wissensvalidierung prüfen
npm run test:knowledge

# Produktionsbundle erstellen
npm run build
```

---

## 📚 Dokumentation

* [docs/IMPLEMENTATION_PLAN_KNOWLEDGE_GRAPH.md](docs/IMPLEMENTATION_PLAN_KNOWLEDGE_GRAPH.md) – Architektur- und Implementierungsplan
* [docs/IMPLEMENTATION_REPORT_KNOWLEDGE_GRAPH.md](docs/IMPLEMENTATION_REPORT_KNOWLEDGE_GRAPH.md) – Abschlussbericht zu V0.2
* [docs/TECHNICAL.md](docs/TECHNICAL.md) – Technische Dokumentation & Architekturleitfaden
* [docs/CONTENT.md](docs/CONTENT.md) – Didaktische Inhalte & Evidenzstufen
* [docs/VISUAL_BIBLE.md](docs/VISUAL_BIBLE.md) – Gestaltungsrichtlinien & Styleguide

---

## 📄 Lizenz

Privates Projekt / Alle Rechte vorbehalten.
