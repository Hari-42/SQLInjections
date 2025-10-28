const { ensureStateFiles } = require('./stateManager');

ensureStateFiles(true);
console.log('Zustandsdateien wurden auf die Seed-Daten zurückgesetzt.');
