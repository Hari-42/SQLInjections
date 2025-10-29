## SQL Injection Lernprojekt

Dieses Projekt zeigt verständlich, was SQL-Injection ist (Angriff) und wie man sich dagegen schützt (Verteidigung). Es gibt zwei Server:
- einen absichtlich unsicheren Server (Port 3000)
- einen sicheren Server mit Schutzmassnahmen (Port 3001)

Alles läuft lokal auf deinem Rechner. Keine fancy Oberfläche – nur einfache Befehle, die du kopieren kannst.

---

## Einfache Anleitung (Copy & Paste)

1) Repository klonen und ins Projekt wechseln
```bash
git clone https://github.com/Hari-42/SQLInjections.git
cd SQLInjections
```

2) Prüfen, ob du auf dem main-Branch bist (wichtig)
```bash
git branch --show-current
```
Wenn nicht „main“, dann umschalten:
```bash
git checkout main
git pull
```

3) Node-Pakete installieren
```bash
npm install
```

4) .env Datei anlegen (in der Projektwurzel)
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=DEIN_MYSQL_PASSWORT
DB_NAME=sql_injection_demo
```

5) MySQL muss laufen. Dann Datenbank erstellen/zurücksetzen
```bash
npm run reset:databases
```

6) Server starten (zwei Terminals öffnen)
- Terminal A (unsicherer Server auf Port 3000):
```bash
npm run start:vulnerable
```
- Terminal B (sicherer Server auf Port 3001):
```bash
npm run start:secure
```

7) Angriffe gegen den unsicheren Server starten (Port 3000)
```bash
npm run attack:C   # Vertraulichkeit: Login-Bypass
npm run attack:A   # Verfügbarkeit: DROP TABLE users
npm run attack:I   # Integrität: UPDATE ohne Erlaubnis
```

8) Gegenmassnahmen auf dem sicheren Server testen (Port 3001)
```bash
npm run defense:C
npm run defense:A
npm run defense:I
```

9) Ergebnisse ansehen
- Angriff-Reports: `reports/attacks/`
- Verteidigungs-Reports: `reports/defenses/`

WICHTIG: Wenn du `attack:A` (DROP TABLE) ausgeführt hast, danach wieder
```bash
npm run reset:databases
```
laufen lassen, damit die Datenbank neu erstellt wird.

---

### Inhalte auf einen Blick
- Verwundbarer Server: string-konkatenierte SQL-Queries, Admin-Endpunkt für rohe Statements
- Sicherer Server: Input Validation, Escaping, Prepared Statements, Stored Procedure
- Angriffs-Skripte: Vertraulichkeit (C), Verfügbarkeit (A), Integrität (I)
- Verteidigungs-Skripte: Schutz für C, A, I
- Reports: JSON-Ausgaben unter `reports/attacks/` und `reports/defenses/`

## Voraussetzungen
- Node.js (LTS)
- Lokaler MySQL-Server (Standardport 3306)

## .env anlegen (Projektwurzel)
Siehe Schnellstart Schritt 4 (Copy & Paste Vorlage enthalten).

## Installation
Siehe Schnellstart Schritt 3 (`npm install`).

## Datenbank initialisieren / zurücksetzen
Siehe Schnellstart Schritt 5 (erstellt DB, Tabelle `users` und Stored Procedure `login_user`).

## Server starten (je in eigenem Terminal)
Siehe Schnellstart Schritt 6 (unsicher: 3000, sicher: 3001).

## API-Endpunkte (Kurzreferenz)
Verwundbarer Server (3000):
- POST `/login` – unsichere Login-Abfrage per String-Konkatenation
- POST `/admin/unsafe-exec` – führt beliebiges SQL aus (Demozwecke)

Sicherer Server (3001):
- GET `/` – Status/Info
- POST `/login` – Validierung + Prepared Statement via `CALL login_user(?, ?)`
- POST `/admin/safe-exec` – einfache Blockliste (DROP/UPDATE/DELETE) und sichere Ausführung

## Angriffe ausführen (gegen 3000)
Siehe Schnellstart Schritt 7. Konfiguration der Payloads unter `attacks/payloads.json`.

## Gegenmassnahmen ausführen (gegen 3001)
Siehe Schnellstart Schritt 8. Strategien unter `defenses/strategies.json`.

## Reports
Siehe Schnellstart Schritt 9. Die JSON-Dateien liegen unter `reports/attacks/` und `reports/defenses/`.

## Troubleshooting
- Nach `attack:A` (DROP TABLE) muss die DB neu erstellt werden:
```bash
npm run reset:databases
```
- MySQL-Verbindungsprobleme: `.env` prüfen (Host/Port/User/Passwort/DB-Name)
- Port-Konflikte: Prüfen, ob 3000/3001 schon belegt sind
- Windows PowerShell: Nutze dieselben Befehle wie oben; stelle sicher, dass MySQL-Dienst läuft

## Rubrikenzuordnung (Kurz)
- Angriffe: C/A/I vorhanden, parametrisierbar und als separate Dateien startbar
- Verteidigungen: Escaping + Input Validation, Prepared Statements/Parametrisierung, Stored Procedure; separat startbar
- Datenquellen: JSON-Dateien für Payloads/Strategien
- Coding-Standards: Fileheader, kurze Beschreibungen, klare Variablennamen

## Sicherheitshinweis
Die unsicheren Endpunkte sind nur zu Demonstrationszwecken gedacht. Nicht in produktiven Umgebungen verwenden.
