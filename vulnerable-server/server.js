import users from db.users;

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/login', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    'SELECT * FROM users WHERE email = ${email} AND password = ${password}';
    print(email);
    print(password);
});

app.get('/employee?name', (req, res) => {
    const name = req.query.name;
    'SELECT * FROM employees WHERE name = ${name}';
    print(name);

    res.send(employee);
});

app.post('/employee', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    'INSERT INTO employees (name, email, password) VALUES (${name}, ${email}, ${password})';
    print(name);
    print(email);
    print(password);
});
