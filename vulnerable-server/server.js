const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DEIN_MYSQL_PASSWORT',
    database: 'firma_datenbank',
    waitForConnections: true,
    connectionLimit: 10
});

app.use(express.json());

app.post('/login', async (req, res) => {
    const username = req.body.username ?? '';
    const password = req.body.password ?? '';
    const sql =
        "SELECT id, username, role FROM user WHERE username = '" +
        username +
        "' AND password = '" +
        password +
        "'";

    try {
        const [rows] = await pool.query(sql);
        if (rows.length === 0) {
            return res.status(401).json({ sql, error: 'Anmeldung fehlgeschlagen' });
        }
        return res.json({ sql, user: rows[0] });
    } catch (error) {
        return res.status(500).json({ sql, error: errorText(error) });
    }
});

app.get('/employee', async (req, res) => {
    const firstName = req.query.first_name ?? '';
    const secondName = req.query.second_name ?? '';
    let sql = 'SELECT id, first_name, second_name, birthdate FROM employee WHERE 1 = 1';

    if (firstName !== '') {
        sql += " AND first_name = '" + firstName + "'";
    }
    if (secondName !== '') {
        sql += " AND second_name = '" + secondName + "'";
    }

    try {
        const [rows] = await pool.query(sql);
        return res.json({ sql, rows });
    } catch (error) {
        return res.status(500).json({ sql, error: errorText(error) });
    }
});

app.post('/employee', async (req, res) => {
    const firstName = req.body.first_name ?? '';
    const secondName = req.body.second_name ?? '';
    const birthdate = req.body.birthdate ?? '';
    const sql =
        "INSERT INTO employee (first_name, second_name, birthdate) VALUES ('" +
        firstName +
        "', '" +
        secondName +
        "', '" +
        birthdate +
        "')";

    try {
        const [result] = await pool.query(sql);
        return res.status(201).json({ sql, id: result.insertId });
    } catch (error) {
        return res.status(500).json({ sql, error: errorText(error) });
    }
});

app.get('/payroll', async (req, res) => {
    const employeeId = req.query.employee_id ?? '';
    const sql =
        "SELECT id, employee_id, payroll_amount FROM payroll WHERE employee_id = '" +
        employeeId +
        "'";

    try {
        const [rows] = await pool.query(sql);
        return res.json({ sql, rows });
    } catch (error) {
        return res.status(500).json({ sql, error: errorText(error) });
    }
});
app.post('/payroll/update', async (req, res) => {
    const id = req.body.id ?? '';
    const amount = req.body.payroll_amount ?? '';
    const sql =
        "UPDATE payroll SET payroll_amount = '" + amount +
        "' WHERE id = '" + id + "'";
    try {
        const [result] = await pool.query(sql);
        return res.json({ sql, affectedRows: result.affectedRows });
    } catch (error) {
        return res.status(500).json({ sql, error: errorText(error) });
    }
});

app.listen(PORT, () => {
    console.log('Vulnerable server listening on http://localhost:' + PORT);
});

function errorText(error) {
    if (error.message) {
        return error.message;
    }
    if (error.errors && error.errors.length > 0) {
        return error.errors.map((item) => item.message).join('; ');
    }
    return error.code || 'Unbekannter Datenbankfehler';
}
