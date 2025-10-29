# SQL Injection Lernprojekt

Kurzanleitung zum Aufsetzen, Starten und Testen (ohne Frontend, alles per Node/HTTP).

## 1) Voraussetzungen
- Node.js (LTS)
- MySQL Server lokal (Port 3306)

## 2) .env anlegen (Projektwurzel)
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=DEIN_MYSQL_PASSWORT
DB_NAME=sql_injection_demo
```

## 3) Installation
```bash
npm install
```

## 4) Datenbank initialisieren / zurücksetzen
```bash
npm run reset:databases
```

## 5) Server starten (je in eigenem Terminal)
- Verwundbarer Server (Port 3000):
```bash
npm run start:vulnerable
```
- Sicherer Server (Port 3001):
```bash
npm run start:secure
```

## 6) Angriffe (gegen 3000)
```bash
npm run attack:C   # Vertraulichkeit (Login-Bypass)
npm run attack:A   # Verfügbarkeit (DROP TABLE)
npm run attack:I   # Integrität (UPDATE)
```

## 7) Gegenmaßnahmen (gegen 3001)
```bash
npm run defense:C
npm run defense:A
npm run defense:I
```

## 8) Reports
- Ergebnisse werden automatisch unter `reports/attacks/` und `reports/defenses/` als JSON abgelegt.

## Hinweise
- Nach `attack:A` (DROP TABLE) Datenbank erneut mit `npm run reset:databases` herstellen.
- Beide Server nutzen dieselbe DB; zuerst Tests für Vertraulichkeit durchführen, dann Verfügbarkeit/Integrität.