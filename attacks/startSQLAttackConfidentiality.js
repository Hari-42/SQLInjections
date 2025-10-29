const { main } = require('/startSQLAttack');

main('C').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});