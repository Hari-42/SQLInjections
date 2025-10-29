const fs = require('fs');
const path = require('path');

const PAYLOAD_FILE = path.join(__dirname, 'payloads.json');
const VULNERABLE_BASE_URL = 'http://localhost:3000';

function readPayloads() {
    return JSON.parse(fs.readFileSync(PAYLOAD_FILE, 'utf8'));
}

async function triggerLogin(username, password) {
    const response = await fetch(`${VULNERABLE_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

async function triggerRawQuery(rawQuery) {
    const response = await fetch(`${VULNERABLE_BASE_URL}/admin/unsafe-exec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawQuery })
    });
    return response.json();
}

async function runConfidentialityAttack(payload) {
    console.log('Starte Angriff auf Vertraulichkeit...');
    console.log(payload.description);
    const result = await triggerLogin(payload.username, payload.password);
    console.log('Antwort des Servers:', result);
}

async function runAvailabilityAttack(payload) {
    console.log('Starte Angriff auf Verfügbarkeit...');
    console.log(payload.description);
    const result = await triggerRawQuery(payload.rawQuery);
    console.log('Antwort des Servers:', result);
}

async function runIntegrityAttack(payload) {
    console.log('Starte Angriff auf Integrität...');
    console.log(payload.description);
    const result = await triggerRawQuery(payload.rawQuery);
    console.log('Antwort des Servers:', result);
}

async function main(customType) {
    const attackType = customType || process.argv[2];
    if (!attackType) {
        console.error('Bitte einen Angriffstyp übergeben: C (Confidentiality), A (Availability) oder I (Integrity).');
        process.exit(1);
    }

    const payloads = readPayloads();
    const upperType = attackType.toUpperCase();

    try {
        if (upperType === 'C') {
            await runConfidentialityAttack(payloads.confidentiality);
        } else if (upperType === 'A') {
            await runAvailabilityAttack(payloads.availability);
        } else if (upperType === 'I') {
            await runIntegrityAttack(payloads.integrity);
        } else {
            console.error('Unbekannter Angriffstyp. Erlaubt sind nur C, A oder I.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Angriff fehlgeschlagen:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };