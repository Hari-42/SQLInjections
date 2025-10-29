/*
Filename: vulnerableServer.js
Kurzbeschreibung: Unsicherer Demo-Server mit absichtlichen SQLi-Schwachstellen.
Aufrufparameter: keine (PORT 3000)
Autor: Sandro 
Datum: 2025-10-29
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '255070',
    database: process.env.DB_NAME || 'sql_injection_demo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

app.post('/login', async (req, res) => {
    const { username = '', password = '' } = req.body;

    const unsafeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    try {
        const [result] = await pool.query(unsafeQuery);
        if (result.length > 0) {
            const users = result.map((user) => ({ id: user.id, username: user.username, password: user.password }));
            res.json({
                status: 'success',
                query: unsafeQuery,
                users
            });
        } else {
            res.status(401).json({ status: 'error', query: unsafeQuery, message: 'Login fehlgeschlagen.' });
        }
    } catch (error) {
        console.error('Fehler bei unsicherer Abfrage:', error);
        res.status(500).json({ status: 'error', query: unsafeQuery, message: 'Serverfehler.' });
    }
});

app.post('/admin/unsafe-exec', async (req, res) => {
    const { rawQuery = '' } = req.body;
    if (!rawQuery.trim()) {
        return res.status(400).json({ status: 'error', message: 'Es muss ein SQL-Statement übergeben werden.' });
    }

    try {
        await pool.query(rawQuery);
        res.json({ status: 'success', message: 'Statement wurde ausgeführt.', query: rawQuery });
    } catch (error) {
        console.error('Fehler bei manueller Ausführung:', error);
        res.status(500).json({ status: 'error', message: error.message, query: rawQuery });
    }
});

app.listen(PORT, () => {
    console.log(`Unsicherer Server läuft auf http://localhost:${PORT}`);
});