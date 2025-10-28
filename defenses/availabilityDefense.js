async function run() {
  const baseUrl = 'http://localhost:3001';
  const maliciousTable = `employees; DROP TABLE employees; --`;

  const response = await fetch(`${baseUrl}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableName: maliciousTable })
  });

  const text = await response.text();
  console.log('--- Geschützter DoS-Test ---');
  console.log(text);
}

run().catch((error) => {
  console.error('Test fehlgeschlagen:', error);
});
