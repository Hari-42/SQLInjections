const { loadState, saveState, ensureStateFiles } = require('./stateManager');

ensureStateFiles();

function getColumns(table) {
  if (!Array.isArray(table) || table.length === 0) {
    return [];
  }
  return Object.keys(table[0]);
}

function normalizeStatements(sql) {
  const withoutComments = sql.replace(/--.*$/gm, '');
  return withoutComments
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

function convertToJavaScriptExpression(expression, columns) {
  if (!expression || expression.trim() === '') {
    return 'true';
  }

  let jsExpression = expression;
  jsExpression = jsExpression.replace(/<>/g, '!==');
  jsExpression = jsExpression.replace(/=/g, '===');
  jsExpression = jsExpression.replace(/\bAND\b/gi, '&&');
  jsExpression = jsExpression.replace(/\bOR\b/gi, '||');
  jsExpression = jsExpression.replace(/\bNOT\b/gi, '!');

  const sortedColumns = [...columns].sort((a, b) => b.length - a.length);
  sortedColumns.forEach((column) => {
    const regex = new RegExp(`\\b${column}\\b`, 'g');
    jsExpression = jsExpression.replace(regex, `record.${column}`);
  });

  return jsExpression;
}

function buildPredicate(whereClause, columns) {
  const jsExpression = convertToJavaScriptExpression(whereClause || 'true', columns);
  return new Function('record', `return ${jsExpression};`);
}

function buildAssignment(column, expression, columns) {
  const jsExpression = convertToJavaScriptExpression(expression, columns);
  return new Function('record', `record.${column} = ${jsExpression};`);
}

function executeSelect(statement, state) {
  const match = statement.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
  if (!match) {
    throw new Error(`Malformed SELECT statement: ${statement}`);
  }

  const [, columnPart, tableName, whereClause] = match;
  const table = state[tableName];

  if (!Array.isArray(table)) {
    throw new Error(`Table "${tableName}" existiert nicht mehr.`);
  }

  const columns = getColumns(table);
  const predicate = buildPredicate(whereClause, columns);
  const selectedRows = table.filter((record) => {
    try {
      return predicate(record);
    } catch (error) {
      return false;
    }
  });

  if (columnPart.trim() === '*') {
    return selectedRows.map((row) => ({ ...row }));
  }

  const requestedColumns = columnPart.split(',').map((column) => column.trim());
  return selectedRows.map((row) => {
    const result = {};
    requestedColumns.forEach((column) => {
      result[column] = row[column];
    });
    return result;
  });
}

function executeUpdate(statement, state) {
  const match = statement.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
  if (!match) {
    throw new Error(`Malformed UPDATE statement: ${statement}`);
  }

  const [, tableName, setPart, whereClause] = match;
  const table = state[tableName];

  if (!Array.isArray(table)) {
    throw new Error(`Table "${tableName}" existiert nicht mehr.`);
  }

  const columns = getColumns(table);
  const predicate = buildPredicate(whereClause || 'true', columns);
  const assignments = setPart.split(',').map((assignment) => assignment.trim());
  const assignmentFns = assignments.map((assignment) => {
    const [column, expression] = assignment.split('=');
    if (!column || typeof expression === 'undefined') {
      throw new Error(`Malformed assignment in UPDATE: ${assignment}`);
    }
    return buildAssignment(column.trim(), expression.trim(), columns);
  });

  let changes = 0;
  table.forEach((record) => {
    let shouldUpdate = false;
    try {
      shouldUpdate = predicate(record);
    } catch (error) {
      shouldUpdate = false;
    }

    if (shouldUpdate) {
      assignmentFns.forEach((fn) => {
        try {
          fn(record);
        } catch (error) {
          // ignore faulty assignment to mimic silent failure on insecure systems
        }
      });
      changes += 1;
    }
  });

  return changes;
}

function executeDrop(statement, state) {
  const match = statement.match(/^DROP\s+TABLE\s+(\w+)/i);
  if (!match) {
    throw new Error(`Malformed DROP TABLE statement: ${statement}`);
  }

  const [, tableName] = match;
  if (!Object.prototype.hasOwnProperty.call(state, tableName)) {
    throw new Error(`Table "${tableName}" existiert nicht.`);
  }

  state[tableName] = null;
}

function createVulnerableEngine() {
  let state = loadState('vulnerable');

  function execute(sql) {
    const statements = normalizeStatements(sql);
    const outputs = [];

    statements.forEach((statement) => {
      const upper = statement.trim().toUpperCase();
      if (upper.startsWith('SELECT')) {
        const rows = executeSelect(statement, state);
        outputs.push({ type: 'select', statement, rows });
      } else if (upper.startsWith('UPDATE')) {
        const changes = executeUpdate(statement, state);
        outputs.push({ type: 'update', statement, changes });
        saveState('vulnerable', state);
      } else if (upper.startsWith('DROP TABLE')) {
        executeDrop(statement, state);
        outputs.push({ type: 'drop', statement });
        saveState('vulnerable', state);
      } else {
        throw new Error(`Unsupported statement: ${statement}`);
      }
    });

    return outputs;
  }

  function reload() {
    state = loadState('vulnerable');
  }

  return {
    execute,
    reload
  };
}

module.exports = {
  createVulnerableEngine
};
