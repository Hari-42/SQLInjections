/*
Filename: counterSQLAttack.js
Kurzbeschreibung: Parametrisierbares Verteidigungsscript (C|A|I) gegen den gesicherten Server.
Aufrufparameter: C (Confidentiality) | A (Availability) | I (Integrity)
Autor: Hari
Datum: 2025-10-29
*/

const fs = require('fs');
const path = require('path');

const STRATEGY_FILE = path.join(__dirname, 'strategies.json');
const SECURE_BASE_URL = 'http://localhost:3001';

function readStrategies() {
    return JSON.parse(fs.readFileSync(STRATEGY_FILE, 'utf8'));
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return response.json();
}

function writeReport(kind, payload, result) {
    const reportsDir = path.join(__dirname, '..', 'reports', 'defenses');
    fs.mkdirSync(reportsDir, { recursive: true });
    const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}-${kind}.json`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify({ kind, payload, result }, null, 2));
    console.log('Report gespeichert unter:', filePath);
}

async function protectConfidentiality(strategy) {
    console.log('Starte Gegenmassnahme für Vertraulichkeit...');
    console.log(strategy.description);
    const result = await postJson(`${SECURE_BASE_URL}/login`, {
        username: strategy.username,
        password: strategy.password
    });
    console.log('Antwort des gesicherten Servers:', result);
    writeReport('confidentiality', strategy, result);
}

async function protectAvailability(strategy) {
    console.log('Starte Gegenmassnahme für Verfügbarkeit...');
    console.log(strategy.description);
    const blocked = await postJson(`${SECURE_BASE_URL}/admin/safe-exec`, {
        rawQuery: 'DROP TABLE users;'
    });
    console.log('Blockierter Versuch:', blocked);
    const allowed = await postJson(`${SECURE_BASE_URL}/admin/safe-exec`, {
        rawQuery: strategy.rawQuery
    });
    console.log('Erlaubter Wartungsbefehl:', allowed);
    writeReport('availability', strategy, { blocked, allowed });
}

async function protectIntegrity(strategy) {
    console.log('Starte Gegenmassnahme für Integrität...');
    console.log(strategy.description);
    const blocked = await postJson(`${SECURE_BASE_URL}/admin/safe-exec`, {
        rawQuery: "UPDATE users SET password='owned' WHERE username='admin';"
    });
    console.log('Blockierter Manipulationsversuch:', blocked);
    const allowed = await postJson(`${SECURE_BASE_URL}/admin/safe-exec`, {
        rawQuery: strategy.procedure
    });
    console.log('Zulässiger Stored-Procedure-Aufruf:', allowed);
    writeReport('integrity', strategy, { blocked, allowed });
}

async function main(customType) {
    const defenseType = customType || process.argv[2];
    if (!defenseType) {
        console.error('Bitte einen Verteidigungstyp übergeben: C (Confidentiality), A (Availability) oder I (Integrity).');
        process.exit(1);
    }

    const strategies = readStrategies();
    const upperType = defenseType.toUpperCase();

    try {
        if (upperType === 'C') {
            await protectConfidentiality(strategies.confidentiality);
        } else if (upperType === 'A') {
            await protectAvailability(strategies.availability);
        } else if (upperType === 'I') {
            await protectIntegrity(strategies.integrity);
        } else {
            console.error('Unbekannter Verteidigungstyp. Erlaubt sind nur C, A oder I.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Verteidigung fehlgeschlagen:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };