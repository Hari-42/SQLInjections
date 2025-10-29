/*
Filename: startSQLAttackIntegrity.js
Kurzbeschreibung: Startet den Integritätsangriff (I) gegen den verwundbaren Server.
Aufrufparameter: keine (fest verdrahtet auf Typ I)
Autor: Sandro
Datum: 2025-10-29
*/

const { main } = require('./startSQLAttack');

main('I').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});