const fs = require('fs');
const SEED_PATH = `${__dirname}/seedData.json`;
const VULNERABLE_STATE = `${__dirname}/vulnerableState.json`;
const SECURE_STATE = `${__dirname}/secureState.json`;

function readSeed() {
  const raw = fs.readFileSync(SEED_PATH, 'utf-8');
  const seed = JSON.parse(raw);

  return {
    users: seed.users.map((user, index) => ({ id: index + 1, ...user })),
    employees: seed.employees.map((employee, index) => ({ id: index + 1, ...employee })),
    auditLog: seed.auditLog.map((entry, index) => ({ id: index + 1, ...entry }))
  };
}

function ensureStateFiles(force = false) {
  const initialData = readSeed();

  if (force || !fs.existsSync(VULNERABLE_STATE)) {
    fs.writeFileSync(VULNERABLE_STATE, JSON.stringify(initialData, null, 2));
  }

  if (force || !fs.existsSync(SECURE_STATE)) {
    fs.writeFileSync(SECURE_STATE, JSON.stringify(initialData, null, 2));
  }
}

function loadState(kind) {
  const target = kind === 'secure' ? SECURE_STATE : VULNERABLE_STATE;
  if (!fs.existsSync(target)) {
    ensureStateFiles();
  }
  const raw = fs.readFileSync(target, 'utf-8');
  return JSON.parse(raw);
}

function saveState(kind, state) {
  const target = kind === 'secure' ? SECURE_STATE : VULNERABLE_STATE;
  fs.writeFileSync(target, JSON.stringify(state, null, 2));
}

module.exports = {
  ensureStateFiles,
  loadState,
  saveState
};
