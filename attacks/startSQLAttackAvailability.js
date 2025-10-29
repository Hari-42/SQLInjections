const { main } = require('/startSQLAttack');

main('A').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});