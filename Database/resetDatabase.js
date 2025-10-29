require('dotenv').config();
/*
Filename: resetDatabase.js
Kurzbeschreibung: Setzt die Demo-Datenbank neu auf und erstellt Stored Procedures.
Aufrufparameter: keine
Autor: Matteo
Datum: 2025-10-29
*/

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const SQL_FILE = path.join(__dirname, 'database.sql');

async function resetDatabase() {
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');

    const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '255070',
    port: Number(process.env.DB_PORT || 3306),
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