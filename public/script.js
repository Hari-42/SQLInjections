const backendRadios = Array.from(document.querySelectorAll('input[name="backend"]'));
const loginForm = document.getElementById('login-form');
const resultBox = document.getElementById('result');

let currentBackend = backendRadios.find((radio) => radio.checked)?.value || '';

backendRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      currentBackend = radio.value;
      showMessage(`Using ${radio.value.includes('3000') ? 'vulnerable' : 'secure'} backend.`, 'info');
    }
  });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentBackend) {
    showMessage('Please choose a backend server.', 'error');
    return;
  }

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${currentBackend}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(`${data.message || 'Request failed.'}\nQuery: ${data.query || 'N/A'}`, 'error');
      return;
    }

    const details = [];
    if (data.query) {
      details.push(`Query: ${data.query}`);
    }
    if (Array.isArray(data.parameters)) {
      details.push(`Parameters: ${JSON.stringify(data.parameters)}`);
    }
    if (Array.isArray(data.data)) {
      details.push(`Rows: ${JSON.stringify(data.data)}`);
    }

    showMessage([data.message, ...details].filter(Boolean).join('\n'), 'success');
  } catch (error) {
    showMessage(`Could not reach server: ${error.message}`, 'error');
  }
});

function showMessage(text, variant) {
  resultBox.textContent = text;
  resultBox.setAttribute('data-variant', variant);
}