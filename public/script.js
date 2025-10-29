/**
 * File: public/script.js
 * Kurzbeschreibung: Frontend-Logik für die Demonstrationsoberfläche.
 * Aufrufparameter: none
 * Autor: SQLInjections Demo Team
 * Datum: 2024-05-01
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const resultBox = document.getElementById('result');
  const sqlBox = document.getElementById('sql-query');
  const variantLabel = document.getElementById('variant-label');

  const port = window.location.port;
  variantLabel.textContent = port === '3001'
    ? 'Aktueller Server: Gesicherte Variante'
    : 'Aktueller Server: Verwundbare Variante';

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    resultBox.dataset.variant = 'info';
    resultBox.textContent = 'Sende Anfrage ...';
    sqlBox.dataset.variant = 'info';
    sqlBox.textContent = 'Wird geladen ...';
    loginForm.querySelector('button').disabled = true;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
        })
      });

      const payload = await response.json();
      resultBox.textContent = JSON.stringify(payload, null, 2);
      sqlBox.textContent = payload.query || payload.safeQuery || 'Keine SQL-Information vorhanden.';

      if (response.ok) {
        resultBox.dataset.variant = 'success';
      } else {
        resultBox.dataset.variant = 'error';
      }
    } catch (error) {
      resultBox.dataset.variant = 'error';
      resultBox.textContent = `Fehler: ${error.message}`;
      sqlBox.textContent = 'Fehler beim Laden der SQL-Information.';
    } finally {
      loginForm.querySelector('button').disabled = false;
    }
  });
});