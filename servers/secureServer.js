const path = require('path');
const express = require('express');
const cors = require('cors');
const { ensureStateFiles, loadState, saveState } = require('../Database/stateManager');

const PORT = process.env.PORT || 3001;

ensureStateFiles();
let state = loadState('secure');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function persist() {
  saveState('secure', state);
}

app.get('/api/variant', (_req, res) => {
  res.json({ variant: 'secure' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Ungültige Eingabe.' });
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();
  const user = state.users.find(
    (entry) => entry.username === trimmedUsername && entry.password === trimmedPassword
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Anmeldung fehlgeschlagen.' });
  }

  const { password: _, ...safeUser } = user;
  return res.json({ success: true, data: safeUser, message: 'Login erfolgreich mit Schutzmassnahmen.' });
});

app.get('/api/employees', (req, res) => {
  const { department = '' } = req.query;
  const sanitizedDepartment = String(department).trim();

  if (!/^[A-Za-zäöüÄÖÜß\s-]*$/.test(sanitizedDepartment)) {
    return res.status(400).json({ success: false, message: 'Unzulässige Eingabe erkannt.' });
  }

  const rows = state.employees.filter((employee) => employee.department === sanitizedDepartment);
  return res.json({ success: true, data: cloneRows(rows) });
});

app.post('/api/update-salary', (req, res) => {
  const { employeeId, newSalary } = req.body;

  const parsedId = Number(employeeId);
  const parsedSalary = Number(newSalary);

  if (!Number.isInteger(parsedId) || !Number.isFinite(parsedSalary) || parsedSalary < 0) {
    return res.status(400).json({ success: false, message: 'Ungültige Parameter übergeben.' });
  }

  const employee = state.employees.find((entry) => entry.id === parsedId);
  if (!employee) {
    return res.status(404).json({ success: false, message: 'Mitarbeiter nicht gefunden.' });
  }

  employee.salary = parsedSalary;
  persist();

  return res.json({ success: true, message: 'Gehalt sicher aktualisiert.', employee: { ...employee } });
});

app.post('/api/report', (req, res) => {
  const { tableName } = req.body;
  const allowedTables = new Set(['users', 'employees', 'auditLog']);

  if (typeof tableName !== 'string' || !allowedTables.has(tableName)) {
    return res.status(400).json({ success: false, message: 'Nicht erlaubter Tabellenname.' });
  }

  const table = state[tableName];
  return res.json({ success: true, data: Array.isArray(table) ? cloneRows(table) : [] });
});

app.post('/api/reload-state', (_req, res) => {
  state = loadState('secure');
  res.json({ success: true, message: 'State reloaded from disk.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Secure server listening on http://localhost:${PORT}`);
});
