const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const SQL_FILE = path.join(__dirname, 'database.sql');

async function resetDatabase() {
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '255070',
        multipleStatements: true
    });

    try {
        await connection.query(sqlContent);
        console.log('Demo-Datenbank erfolgreich neu erstellt.');
    } finally {
        await connection.end();
    }
}

resetDatabase().catch((error) => {
    console.error('Fehler beim Zurücksetzen der Datenbank:', error.message);
    process.exitCode = 1;
});