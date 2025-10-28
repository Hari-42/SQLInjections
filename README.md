# SQL Injection Lernprojekt

Dieses Projekt demonstriert eine dreischichtige Anwendung mit einer verwundbaren und einer gesicherten Variante.
Es dient als Übungsumgebung für SQL-Injection-Angriffe sowie die entsprechenden Gegenmassnahmen.

## Struktur

- **Presentation Layer**: `public/` enthält eine einfache Oberfläche, die beide Servervarianten bedienen kann.
- **Logic Layer**: `servers/vulnerableServer.js` und `servers/secureServer.js` implementieren die Businesslogik.
- **Data Layer**: Die Daten liegen als JSON in `Database/seedData.json` und werden beim Start in zustandsspezifische Dateien geschrieben.
- **Angriffe**: Unter `attacks/` befinden sich Skripte für Vertraulichkeit, Verfügbarkeit und Integrität.
- **Verteidigung**: Entsprechende Gegenbeispiele liegen unter `defenses/`.

## Vorbereitung

```bash
npm install
npm run reset:databases
```

## Server starten

```bash
npm run start:vulnerable   # startet den verwundbaren Server auf Port 3000
npm run start:secure       # startet den gesicherten Server auf Port 3001
```

Rufen Sie jeweils `http://localhost:PORT` im Browser auf. Die Oberfläche erkennt anhand des Ports automatisch,
welche Variante aktiv ist.

## Angriffs- und Verteidigungsskripte

Die Skripte setzen Node.js ≥ 18 (wegen des globalen `fetch`) voraus.

```bash
# Angriffe gegen den verwundbaren Server (Port 3000)
node attacks/confidentialityAttack.js
node attacks/integrityAttack.js
node attacks/availabilityAttack.js

# Gegenmassnahmen auf dem gesicherten Server (Port 3001)
node defenses/confidentialityDefense.js
node defenses/integrityDefense.js
node defenses/availabilityDefense.js
```

Nach destruktiven Tests (z. B. DoS) können die Datenbanken über `npm run reset:databases`
wieder in den Ausgangszustand versetzt werden. Anschliessend lassen sich die laufenden
Server optional mit `POST /api/reload-state` aktualisieren.
