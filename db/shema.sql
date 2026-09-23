DROP DATABASE IF EXISTS firma_datenbank;
CREATE DATABASE firma_datenbank;
USE firma_datenbank;

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL

);


CREATE TABLE payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    payroll_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);


CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee'
);