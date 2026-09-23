const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seed() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            multipleStatements: true
        });
        const schema = fs.readFileSync(path.join(__dirname, 'shema.sql'), 'utf8');
        await connection.query(schema);

        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-seed.json'), 'utf8'));

        //inserts data into database
        for (const e of data.employees) {
            await connection.query(
                'INSERT INTO employee (first_name, second_name, birthdate) VALUES (?, ?, ?)',
                [e.first_name, e.second_name, e.birthdate]
            );
        }

        for (const p of data.payroll) {
            await connection.query(
                'INSERT INTO payroll (employee_id, payroll_amount) VALUES (?, ?)',
                [p.employee_id, p.payroll_amount]
            );
        }

        for (const u of data.users) {
            await connection.query(
                'INSERT INTO user (username, password, role) VALUES (?, ?, ?)',
                [u.username, u.password, u.role]
            );
        }

        console.log('Seed erfolgreich abgeschlossen');
    } catch (err) {
        console.error('Fehler beim Seeden:', err.message);
    } finally {
        if (connection) await connection.end();
    }

    }
    seed();
