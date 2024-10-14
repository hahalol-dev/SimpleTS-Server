import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'mysql';

const app = express();
app.use(bodyParser.json());

const connection = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test_db',
});

app.post('/vulnerable-query', (req, res) => {
    const userInput = req.body.input; // external input from user

    // Vulnerable query - SQL Injection (due to direct user input in the query)
    const query1 = `SELECT * FROM users WHERE username = '${userInput}'`;
    connection.query(query1, (error, results) => {
        if (error) {
            res.status(500).send('Error in the query');
        } else {
            res.json(results);
        }
    });
});

app.get('/safe-query-int', (req, res) => {
    const id = parseInt(req.query.id as string, 10); // input is a number

    // Safe query - the external input is an integer
    const query2 = `SELECT * FROM users WHERE id = ${id}`;
    connection.query(query2, (error, results) => {
        if (error) {
            res.status(500).send('Error in the query');
        } else {
            res.json(results);
        }
    });
});

app.get('/safe-query-constant', (req, res) => {
    const fixedUsername = 'admin'; // constant value

    // Safe query - the value is constant
    const query3 = `SELECT * FROM users WHERE username = '${fixedUsername}'`;
    connection.query(query3, (error, results) => {
        if (error) {
            res.status(500).send('Error in the query');
        } else {
            res.json(results);
        }
    });
});

app.listen(3000, () => {
    console.log('Server 1 running on port 3000');
});
