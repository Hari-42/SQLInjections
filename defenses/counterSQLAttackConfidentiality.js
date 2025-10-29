const { main } = require('./counterSQLAttack');

main('C').catch((error) => {
    console.error('Verteidigung fehlgeschlagen:', error.message);
    process.exit(1);
});