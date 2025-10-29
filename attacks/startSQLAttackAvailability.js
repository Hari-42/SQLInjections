/*
Filename: startSQLAttackAvailability.js
Kurzbeschreibung: Startet den Verfügbarkeitsangriff (A) gegen den verwundbaren Server.
Aufrufparameter: keine (fest verdrahtet auf Typ A)
Autor: Sandro
Datum: 2025-10-29
*/

const { main } = require('./startSQLAttack');

main('A').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});