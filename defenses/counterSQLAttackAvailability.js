const { main } = require('./counterSQLAttack');

main('A').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});