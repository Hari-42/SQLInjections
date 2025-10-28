async function run() {
  const baseUrl = 'http://localhost:3001';
  const loginPayload = {
    username: `' OR '1'='1' --`,
    password: 'irrelevant'
  };

  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginPayload)
  });

  const body = await response.json();
  console.log('--- Geschützter Login ---');
  console.log(JSON.stringify(body, null, 2));

  const employeesResponse = await fetch(`${baseUrl}/api/employees?department=${encodeURIComponent(`' OR '1'='1`)}`);
  const employeesBody = await employeesResponse.json();
  console.log('\n--- Geschützte Mitarbeitersuche ---');
  console.log(JSON.stringify(employeesBody, null, 2));
}

run().catch((error) => {
  console.error('Test fehlgeschlagen:', error);
});
