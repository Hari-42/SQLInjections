async function run() {
  const baseUrl = 'http://localhost:3001';
  const payload = {
    employeeId: '1',
    newSalary: `0; UPDATE employees SET salary = salary + 20000 WHERE department = 'Finance'; --`
  };

  const response = await fetch(`${baseUrl}/api/update-salary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  console.log('--- Geschützter Integritäts-Test ---');
  console.log(text);
}

run().catch((error) => {
  console.error('Test fehlgeschlagen:', error);
});
