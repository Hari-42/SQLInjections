const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Datenbankverbindung
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Ändern Sie dies zu Ihrem MySQL-Passwort
    database: 'login_db'
});

// Datenbankverbindung herstellen
db.connect((err) => {
    if (err) {
        console.error('Fehler bei der Datenbankverbindung:', err);
        return;
    }
    console.log('Erfolgreich mit der MySQL-Datenbank verbunden');
    
    // Tabelle erstellen falls sie nicht existiert
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Fehler beim Erstellen der Tabelle:', err);
        } else {
            console.log('Tabelle "users" ist bereit');
        }
    });
});

// Login-Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Benutzername und Passwort sind erforderlich' 
        });
    }
    
    // Benutzer in der Datenbank speichern
    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    
    db.query(insertQuery, [username, password], (err, result) => {
        if (err) {
            console.error('Fehler beim Speichern:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Fehler beim Speichern der Daten' 
            });
        }
        
        console.log('Neuer Benutzer gespeichert:', { username, id: result.insertId });
        res.json({ 
            success: true, 
            message: 'Login-Daten erfolgreich gespeichert',
            userId: result.insertId 
        });
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
