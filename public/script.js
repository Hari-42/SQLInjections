const loginForm = document.getElementById('login-form');
const resultBox = document.getElementById('result');
const variantLabel = document.getElementById('variant-label');

async function loadVariant() {
  try {
    const response = await fetch('/api/variant');
    if (!response.ok) {
      variantLabel.textContent = 'Server-Variante konnte nicht geladen werden.';
      return;
    }

 const data = await response.json();
    if (data.variant === 'secure') {
      variantLabel.textContent = 'Verbunden mit: Sicherer Server (Port 3001)';
    } else if (data.variant === 'vulnerable') {
      variantLabel.textContent = 'Verbunden mit: Verwundbarer Server (Port 3000)';
    } else {
      variantLabel.textContent = `Verbunden mit: ${data.variant}`;
    }
  } catch (error) {
    variantLabel.textContent = `Server-Variante konnte nicht ermittelt werden: ${error.message}`;
  }
}

loadVariant();

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    const details = [];

    if (data.query) {
      details.push(`Query: ${data.query}`);
    }

    if (Array.isArray(data.parameters)) {
      details.push(`Parameters: ${JSON.stringify(data.parameters)}`);
    }
     if (data.expression) {
      details.push(`Expression: ${data.expression}`);
    }

    if (Array.isArray(data.data)) {
      details.push(`Rows: ${JSON.stringify(data.data)}`);
    }

    const variant = response.ok ? 'success' : 'error';
    const message = [data.message || 'Request completed.', ...details]
      .filter(Boolean)
      .join('\n');

    showMessage(message, variant);
  } catch (error) {
    showMessage(`Could not reach server: ${error.message}`, 'error');
  }
});

function showMessage(text, variant) {
  resultBox.textContent = text;
  resultBox.setAttribute('data-variant', variant);
}