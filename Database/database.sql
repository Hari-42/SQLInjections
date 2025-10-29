DROP DATABASE IF EXISTS sql_injection_demo;
CREATE DATABASE sql_injection_demo;
USE sql_injection_demo;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password) VALUES
    ('admin', 'password123'),
    ('fritzli', 'password456'),
    ('student', 'sqlrocks');
DROP PROCEDURE IF EXISTS login_user;
CREATE PROCEDURE login_user (
    IN p_username VARCHAR(100),
    IN p_password VARCHAR(100)
)
BEGIN
    SELECT id, username
    FROM users
    WHERE username = p_username
      AND password = p_password;
END;

