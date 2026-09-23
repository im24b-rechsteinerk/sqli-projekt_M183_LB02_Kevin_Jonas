const express = require('express');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

const dbFile = path.join(__dirname, '..', 'db', 'app.db');
const schemaFile = path.join(__dirname, '..', 'db', 'shema.sql');
const db = new DatabaseSync(dbFile);

const usersTable = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
    .get();

if (!usersTable) {
    db.exec(fs.readFileSync(schemaFile, 'utf8'));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
    const email = req.body.email ?? '';
    const password = req.body.password ?? '';
    const sql =
        "SELECT id, name, email FROM users WHERE email = '" +
        email +
        "' AND password = '" +
        password +
        "'";

    try {
        const user = db.prepare(sql).get();
        if (!user) {
            return renderPage(res, 'Anmeldung', '<p>Anmeldung fehlgeschlagen.</p>', sql);
        }
        return renderPage(
            res,
            'Anmeldung',
            '<p>Angemeldet als ' + escapeHtml(user.name) + ' (' + escapeHtml(user.email) + ').</p>',
            sql
        );
    } catch (error) {
        return renderPage(res, 'Anmeldung', '<p class="error">' + escapeHtml(error.message) + '</p>', sql, 500);
    }
});

app.get('/employee', (req, res) => {
    const name = req.query.name ?? '';
    const sql = "SELECT id, name, email FROM employees WHERE name = '" + name + "'";

    try {
        const employees = db.prepare(sql).all();
        return renderPage(res, 'Suche', renderTable(employees), sql);
    } catch (error) {
        return renderPage(res, 'Suche', '<p class="error">' + escapeHtml(error.message) + '</p>', sql, 500);
    }
});

app.post('/employee', (req, res) => {
    const name = req.body.name ?? '';
    const email = req.body.email ?? '';
    const password = req.body.password ?? '';
    const sql =
        "INSERT INTO employees (name, email, password) VALUES ('" +
        name +
        "', '" +
        email +
        "', '" +
        password +
        "')";

    try {
        db.exec(sql);
        return renderPage(res, 'Erfassung', '<p>Mitarbeitende Person wurde gespeichert.</p>', sql);
    } catch (error) {
        return renderPage(res, 'Erfassung', '<p class="error">' + escapeHtml(error.message) + '</p>', sql, 500);
    }
});

app.listen(PORT, () => {
    console.log('Vulnerable server listening on http://localhost:' + PORT);
});

function renderTable(rows) {
    if (rows.length === 0) {
        return '<p>Keine Treffer.</p>';
    }

    const header = Object.keys(rows[0])
        .map((column) => '<th>' + escapeHtml(column) + '</th>')
        .join('');
    const body = rows
        .map((row) => {
            const cells = Object.values(row)
                .map((value) => '<td>' + escapeHtml(value) + '</td>')
                .join('');
            return '<tr>' + cells + '</tr>';
        })
        .join('');

    return '<table><thead><tr>' + header + '</tr></thead><tbody>' + body + '</tbody></table>';
}

function renderPage(res, title, body, sql, status = 200) {
    res.status(status).send(
        '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">' +
            '<title>' + escapeHtml(title) + '</title>' +
            '<link rel="stylesheet" href="/style.css"></head><body><main>' +
            '<h1>' + escapeHtml(title) + '</h1>' +
            body +
            '<h2>Ausgeführtes SQL</h2><pre>' + escapeHtml(sql) + '</pre>' +
            '<p><a class="button" href="/">Zurück</a></p>' +
            '</main></body></html>'
    );
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}
