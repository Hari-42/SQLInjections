const path = require('path');
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const USERS = [
  { username: 'alice', password: 'wonderland', role: 'admin' },
  { username: 'bob', password: 'builder', role: 'user' }
];

function executeSafeLoginQuery(username, password) {
  const query = 'SELECT username, role FROM users WHERE username = ? AND password = ?';
  const parameters = [username, password];
  const rows = USERS.filter(
    (user) => user.username === username && user.password === password
  ).map(({ username: name, role }) => ({ username: name, role }));

  return { query, parameters, rows };
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/api/variant', (_req, res) => {
  res.json({ variant: 'secure' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Ungültige Eingabe.' });
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();
  const { query, parameters, rows } = executeSafeLoginQuery(trimmedUsername, trimmedPassword);

  if (trimmedUsername.length === 0 || trimmedPassword.length === 0) {
    return res.status(400).json({
      success: false,
      query,
      parameters,
      message: 'Benutzername und Passwort dürfen nicht leer sein.'
    });
  }

  if (rows.length === 0) {
    return res.status(401).json({
      success: false,
      query,
      parameters,
      message: 'Anmeldung fehlgeschlagen (sicherer Server).'
    });
  }

  return res.json({
    success: true,
    query,
    parameters,
    data: rows,
    message: 'Login erfolgreich auf dem sicheren Server.'
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Secure server listening on http://localhost:${PORT}`);
});
