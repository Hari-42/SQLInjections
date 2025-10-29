/*
Filename: startSQLAttackConfidentiality.js
Kurzbeschreibung: Startet den Vertraulichkeitsangriff (C) gegen den verwundbaren Server.
Aufrufparameter: keine (fest verdrahtet auf Typ C)
Autor: Sandro
Datum: 2025-10-29
*/

const { main } = require('./startSQLAttack');

main('C').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});