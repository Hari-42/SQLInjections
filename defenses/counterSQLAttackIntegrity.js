const { main } = require('./counterSQLAttack');

main('I').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});