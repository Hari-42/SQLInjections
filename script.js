document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageDiv.textContent = data.message;
                messageDiv.className = 'message success';
                loginForm.reset();
            } else {
                messageDiv.textContent = data.message;
                messageDiv.className = 'message error';
            }
        } catch (error) {
            messageDiv.textContent = 'Fehler beim Verbinden mit dem Server';
            messageDiv.className = 'message error';
            console.error('Fehler:', error);
        }
    });
});
