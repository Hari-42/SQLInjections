/*
Filename: secureServer.js
Kurzbeschreibung: Gehärteter Demo-Server mit Input Validation, Escaping, Prepared Statements und Stored Procedure.
Aufrufparameter: keine (PORT 3001)
Autor: Sandro
Datum: 2025-10-29
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const PORT = 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '255070',
    database: process.env.DB_NAME || 'sql_injection_demo',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const INPUT_PATTERN = /^[\w@.-]{1,40}$/i;

function escapeInput(value) {
    return value.replace(/[\\']/g, (character) => `\\${character}`);
}

function validateCredentials(username, password) {
    const violations = [];
    if (!INPUT_PATTERN.test(username)) {
        violations.push('Username enthält ungültige Zeichen.');
    }
    if (!INPUT_PATTERN.test(password)) {
        violations.push('Password enthält ungültige Zeichen.');
    }
    return violations;
}

app.get('/', (_req, res) => {
    res.json({
        status: 'running',
        server: 'secure',
        description: 'Gehärteter Demo-Server mit Abwehrmassnahmen.',
        endpoints: {
            login: 'POST /login',
            safeExecution: 'POST /admin/safe-exec'
        }
    });

});

app.post('/login', async (req, res) => {
    const { username = '', password = '' } = req.body;
    const violations = validateCredentials(username, password);
    if (violations.length > 0) {
        return res.status(400).json({ status: 'error', message: violations.join(' ') });
    }

    const escapedUsername = escapeInput(username);
    const escapedPassword = escapeInput(password);

    try {
        const [rows] = await pool.execute('CALL login_user(?, ?)', [username, password]);
        const users = rows[0] || [];
        if (users.length > 0) {
            res.json({
                status: 'success',
                message: 'Login erfolgreich.',
                safeQuery: `CALL login_user('${escapedUsername}', '${escapedPassword}')`,
                users
            });
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Login fehlgeschlagen.',
                safeQuery: `CALL login_user('${escapedUsername}', '${escapedPassword}')`
            });
        }
    } catch (error) {
        console.error('Fehler bei sicherer Abfrage:', error);
        res.status(500).json({ status: 'error', message: 'Serverfehler.' });
    }
});

app.post('/admin/safe-exec', async (req, res) => {
    const { rawQuery = '' } = req.body;
    if (!rawQuery.trim()) {
        return res.status(400).json({ status: 'error', message: 'Es muss ein SQL-Statement übergeben werden.' });
    }

    const prohibitedPattern = /(drop\s+table|update\s+users|delete\s+from)/i;
    if (prohibitedPattern.test(rawQuery)) {
        return res.status(400).json({ status: 'error', message: 'Verdächtiges Statement wurde blockiert.' });
    }

    try {
        await pool.execute(rawQuery);
        res.json({ status: 'success', message: 'Statement sicher ausgeführt.' });
    } catch (error) {
        console.error('Fehler bei sicherer manueller Ausführung:', error);
        res.status(500).json({ status: 'error', message: 'Ausführung fehlgeschlagen.' });
    }
});

app.listen(PORT, () => {
    console.log(`Sicherer Server läuft auf http://localhost:${PORT}`);
});