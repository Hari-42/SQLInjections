const path = require('path');
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const USERS = [
  { username: 'alice', password: 'wonderland', role: 'admin' },
  { username: 'bob', password: 'builder', role: 'user' }
];

function unsafeQuery(query) {
  const whereMatch = query.match(/where\s+(.+)$/i);

  if (!whereMatch) {
    return { rows: USERS.map(({ username, role }) => ({ username, role })), expression: 'true' };
  }

  const condition = whereMatch[1];

  const jsCondition = condition
    .replace(/=/g, '===')
    .replace(/\bAND\b/gi, '&&')
    .replace(/\bOR\b/gi, '||')
    .replace(/username/gi, 'user.username')
    .replace(/password/gi, 'user.password')
    .replace(/role/gi, 'user.role');

  const filter = new Function('user', `return ${jsCondition};`);
  const rows = USERS.filter((user) => {
    try {
      return filter(user);
    } catch (error) {
      throw new Error(`Failed to run SQL: ${error.message}`);
    }
  }).map(({ username, role }) => ({ username, role }));

  return { rows, expression: jsCondition };
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/variant', (_req, res) => {
  res.json({ variant: 'vulnerable' });
});

app.post('/api/login', (req, res) => {
  const username = String(req.body.username || '');
  const password = String(req.body.password || '');

  const query = `SELECT username, role FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const { rows, expression } = unsafeQuery(query);

    if (rows.length > 0) {
      return res.json({
        success: true,
        query,
        expression,
        data: rows,
        message: 'Login succeeded on vulnerable server.'
      });
    }

    return res.status(401).json({ success: false, query, expression, message: 'Invalid credentials.' });
  } catch (error) {
    return res.status(500).json({ success: false, query, message: error.message });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Vulnerable server listening on http://localhost:${PORT}`);
});