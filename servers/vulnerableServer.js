const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Connection pool
const pool = mysql.createPool({
    // enter your data to connect to the database
    host: 'localhost',
    user: 'root',
    password: '255070',
    database: 'express_login_demo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Login route (vulnerable to SQL injection)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
 try {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
const [result] = await pool.query(query);
if (result.length > 0) {
            let userList = result.map(user => `${user.username} (${user.password})`);
            res.send(userList.join('<br>'));
        } else {
            res.send('Login failed');
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server error');
    }
});
// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});