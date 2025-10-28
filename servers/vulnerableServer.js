const path = require('path');
const express = require('express');
const cors = require('cors');
const { createVulnerableEngine } = require('../Database/vulnerableEngine');
const { ensureStateFiles } = require('../Database/stateManager');

const PORT = process.env.PORT || 3000;

ensureStateFiles();
const engine = createVulnerableEngine();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/variant', (_req, res) => {
  res.json({ variant: 'vulnerable' });
});

app.post('/api/login', (req, res) => {
  const { username = '', password = '' } = req.body;
  const query = `SELECT id, username, role FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const executions = engine.execute(query);
    const result = executions.find((entry) => entry.type === 'select');

    if (result && result.rows.length > 0) {
      return res.json({
        success: true,
        query,
        executions,
        data: result.rows,
        message: 'Login erfolgreich (verwundbare Variante)'
      });
    }

    return res.status(401).json({
      success: false,
      query,
      executions,
      message: 'Ungültige Anmeldedaten.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, query, error: error.message });
  }
});

app.get('/api/employees', (req, res) => {
  const { department = '' } = req.query;
  const query = `SELECT id, fullName, department, salary, email FROM employees WHERE department = '${department}'`;

  try {
    const executions = engine.execute(query);
    const result = executions.find((entry) => entry.type === 'select');
    return res.json({ success: true, query, executions, data: result ? result.rows : [] });
  } catch (error) {
    return res.status(500).json({ success: false, query, error: error.message });
  }
});

app.post('/api/update-salary', (req, res) => {
  const { employeeId = '', newSalary = '' } = req.body;
  const query = `UPDATE employees SET salary = ${newSalary} WHERE id = ${employeeId}`;

  try {
    const executions = engine.execute(query);
    const updateResult = executions.find((entry) => entry.type === 'update');
    return res.json({ success: true, query, executions, changes: updateResult ? updateResult.changes : 0 });
  } catch (error) {
    return res.status(500).json({ success: false, query, error: error.message });
  }
});

app.post('/api/report', (req, res) => {
  const { tableName = '' } = req.body;
  const query = `SELECT * FROM ${tableName}`;

  try {
    const executions = engine.execute(query);
    return res.json({ success: true, query, executions });
  } catch (error) {
    return res.status(500).json({ success: false, query, error: error.message });
  }
});

app.post('/api/reload-state', (_req, res) => {
  engine.reload();
  res.json({ success: true, message: 'State reloaded from disk.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Vulnerable server listening on http://localhost:${PORT}`);
});
