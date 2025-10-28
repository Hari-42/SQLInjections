const resultFormatter = new Intl.DateTimeFormat('de-CH', {
  dateStyle: 'short',
  timeStyle: 'medium'
});

function stringifyResult(data) {
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
}

async function sendRequest(url, options = {}) {
  const config = { method: 'GET', headers: {}, ...options };

  if (config.body && typeof config.body !== 'string') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    payload = text;
  }

  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && payload.message
      ? payload.message
      : 'Anfrage fehlgeschlagen.';
    throw new Error(`${response.status}: ${message}\nAntwort: ${stringifyResult(payload)}`);
  }

  return payload;
}

function attachHandler(formId, resultId, { method, path, buildUrl, buildBody }) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    result.textContent = 'Sende Anfrage…';

    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());

    try {
      const url = buildUrl ? buildUrl(entries) : path;
      const body = buildBody ? buildBody(entries) : entries;
      const response = await sendRequest(url, { method, body: method === 'GET' ? undefined : body });
      result.textContent = stringifyResult(response);
    } catch (error) {
      result.textContent = error.message;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const banner = document.getElementById('variantBanner');

  try {
    const { variant } = await sendRequest('/api/variant');
    const timestamp = resultFormatter.format(new Date());
    banner.textContent = `Aktueller Servermodus: ${variant === 'secure' ? 'gesichert' : 'verwundbar'} (Stand ${timestamp})`;
    banner.dataset.variant = variant;
  } catch (error) {
    banner.textContent = 'Variante konnte nicht ermittelt werden.';
    console.error(error);
  }

  attachHandler('loginForm', 'loginResult', {
    method: 'POST',
    path: '/api/login'
  });

  attachHandler('searchForm', 'searchResult', {
    method: 'GET',
    path: '/api/employees',
    buildUrl: (entries) => `/api/employees?department=${encodeURIComponent(entries.department)}`,
    buildBody: () => undefined
  });

  attachHandler('salaryForm', 'salaryResult', {
    method: 'POST',
    path: '/api/update-salary'
  });

  attachHandler('reportForm', 'reportResult', {
    method: 'POST',
    path: '/api/report'
  });
});
