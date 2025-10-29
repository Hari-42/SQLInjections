/*
Filename: counterSQLAttackConfidentiality.js
Kurzbeschreibung: Startet die Vertraulichkeits-Verteidigung (C) gegen den gesicherten Server.
Aufrufparameter: keine (fest verdrahtet auf Typ C)
Autor: Hari
Datum: 2025-10-29
*/

const { main } = require('./counterSQLAttack');

main('C').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});