document.addEventListener('DOMContentLoaded', () => {
    let sqlQuery = document.getElementById('sqlQuery');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let check = document.getElementById('check');
    check.addEventListener('click', () => {
        sqlQuery.innerText = `SELECT * FROM users WHERE username = '${username.value}' AND password = '${password.value}'`;
    })
})