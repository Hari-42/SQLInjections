const { main } = require('/startSQLAttack');

main('I').catch((error) => {
    console.error('Angriff fehlgeschlagen:', error.message);
    process.exit(1);
});