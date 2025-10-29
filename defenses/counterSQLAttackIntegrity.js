/*
Filename: counterSQLAttackIntegrity.js
Kurzbeschreibung: Startet die Integritäts-Verteidigung (I) gegen den gesicherten Server.
Aufrufparameter: keine (fest verdrahtet auf Typ I)
Autor: Hari
Datum: 2025-10-29
*/

const { main } = require('./counterSQLAttack');

main('I').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});