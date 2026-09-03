# Große Landkarte der Psychotherapie (Ebene 1): Architektur & Geografie

**Status:** Implementiert & Funktionsfähig  
**Branch:** `prototype/inner-atlas-v01`  
**Datum:** 03. September 2026

---

## 1. Das hierarchische 3-Ebenen-Konzept

Die Psychotherapie-Landkarte folgt einer dreistufigen räumlichen und didaktischen Ordnung:

```
┌────────────────────────────────────────────────────────────────────────┐
│  EBENE 1: Große Weltkarte der Psychotherapie                           │
│  • Weite Kontinentalkarte mit den 4 großen Traditionen + Freiräumen    │
│  • KVT (Osten), Psychoanalyse (Nordwesten), Humanistik (Westen),        │
│    Systemik (Südwesten) und die zentrale Erkundungsregion              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Klick auf Zentralregion
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  EBENE 2: Zentralregion – Erkundung des therapeutischen Arbeitens      │
│  • Detailreiche Regionalkarte mit allen 37 Schauplätzen                │
│  • Schulenübergreifendes Erkunden von Gefühlen, Gedanken, Körper,     │
│    Beziehungen, Ressourcen, Veränderungsprozessen und Sicherheit       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Klick auf „Ort betreten“
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  EBENE 3: Lokale Erkundung (Point-and-Click-Szenen)                    │
│  • Begehbare Innenansichten und Interaktionsräume                      │
│  • Werkstatt der Erprobung, Leuchtturm der Evidenz, Bahnhof            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Die 5 Großregionen auf der Hauptkarte (Ebene 1)

### 1. Zentralregion – Erkundung des therapeutischen Arbeitens (Mitte)
* **Status:** Vollständig begehbar (führt zu den 37 Schauplätzen auf Ebene 2).
* **Visuelles Motiv:** Leuchtender Orientierungsleuchtturm und Kompass-Pavillon an der Mündung der großen Flüsse.
* **Didaktische Funktion:** Ermöglicht Suchenden eine schulenunabhängige Orientierung anhand eigener Fragestellungen (Wirkfaktoren, Zusammenarbeit, basale Stabilisierung, praktische Übungen).

### 2. Kognitive Verhaltenstherapie / KVT (Osten)
* **Status:** In Vorbereitung (interaktiver Info-Drawer aktiv).
* **Visuelles Motiv:** Weitläufige, gut erschlossene Kulturlandschaft mit klaren Wegen, strukturierten Werkstätten, Beobachtungstürmen und Übungsparcours.
* **Grundgedanke:** Veränderung von Denken und Handeln durch Hypothesenprüfung, sokratischen Dialog, Verhaltensexperimente und Alltagstransfer.

### 3. Psychoanalyse & Tiefenpsychologie (Nordwesten)
* **Status:** In Vorbereitung (interaktiver Info-Drawer aktiv).
* **Visuelles Motiv:** Geschichtete Gebirgslandschaft mit tiefliegenden Bibliotheken, Felsenarchiven, Höhlen und historischen Schichten.
* **Grundgedanke:** Aufdecken und Durcharbeiten unbewusster Konflikte, früher Beziehungserfahrungen und Schutzmechanismen in der therapeutischen Beziehung.

### 4. Systemische Therapie (Südwesten)
* **Status:** In Vorbereitung (interaktiver Info-Drawer aktiv).
* **Visuelles Motiv:** Vernetztes Siedlungsensemble aus miteinander verbundenen Häusern, Holzbrücken über Flussläufe und gemeinschaftlichen Plätzen mit Blickachsen.
* **Grundgedanke:** Symptome als sinnhafte Reaktionen auf Dynamiken, Rollen und Regeln im zwischenmenschlichen Beziehungssystem (Familie, Partnerschaft, Umfeld).

### 5. Personzentrierte & Humanistische Psychotherapie (Westen)
* **Status:** In Vorbereitung (interaktiver Info-Drawer aktiv).
* **Visuelles Motiv:** Offener, sonnendurchfluteter Garten- und Naturraum mit Pavillons, lichten Hainen und Plätzen für echte Begegnung und inneres Spüren.
* **Grundgedanke:** Entfaltung der angeborenen Selbstaktualisierungstendenz in einem Klima bedingungsloser Wertschätzung, Empathie und Echtheit (Rogers, Gestalt, Focusing).

---

## 3. Geografische Freiräume für zukünftige Ansätze

Die Hauptkarte ist bewusst **nicht als abgeschlossenes Vier-Quadranten-Schema** angelegt, sondern lässt weite, unberührte Naturräume und Übergangszonen frei:

* **Zwischen KVT und Humanistik/Achtsamkeit (Nordost/Zentrum):** Platz für Dritte-Welle-Verfahren wie **ACT (Akzeptanz- und Commitmenttherapie)** und **DBT (Dialektisch-Behaviorale Therapie)**.
* **Zwischen KVT und Tiefenpsychologie (Norden):** Platz für **Schematherapie** (Integration von Kognition, Emotion und Biografie).
* **Zwischen Tiefenpsychologie und Humanistik (West-Hochland):** Platz für **Mentalisierungsbasierte Therapie (MBT)** und **Emotionsfokussierte Therapie (EFT)**.
* **Zwischen Humanistik und Körperorientierung (Südwest):** Platz für **Gestalttherapie**, **Focusing** und **Körperpsychotherapie**.
* **Zwischen KVT und Traumatherapie (Ost-Gipfel):** Platz für **EMDR** und spezialisierte Expositionsverfahren.

---

## 4. Durchgängiges Breadcrumb- und Navigationskonzept

* **Ebene 1:** `🗺️ Landkarte der Psychotherapie • Ebene 1 • Große Weltkarte der Therapielandschaften`
* **Ebene 2:** `[⤺ Zur Weltkarte] Weltkarte › 🧭 Zentralregion (37 Schauplätze)`
* **Ebene 3:** `[⤺ Zur Zentralregion] Weltkarte › Zentralregion › 🔨 Werkstatt der Erprobung`
* Ein Klick auf jedes Segment im Breadcrumb-Pfad oder den jeweiligen **„Herauszoomen“-Button** führt unmittelbar und sicher zur übergeordneten Ebene zurück.
