/*
Filename: counterSQLAttackAvailability.js
Kurzbeschreibung: Startet die Verfügbarkeits-Verteidigung (A) gegen den gesicherten Server.
Aufrufparameter: keine (fest verdrahtet auf Typ A)
Autor: Hari
Datum: 2025-10-29
*/

const { main } = require('./counterSQLAttack');

main('A').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});