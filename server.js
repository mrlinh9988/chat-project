import express from "express";
const app = express();
const port = 3000;
const hostname = 'localhost';

app.get('/alo', (req, res) => {
    res.send('<h1>alo</h1>')
});

app.listen(port, hostname, () => console.log(`Server start ${hostname}:${port}/`));


