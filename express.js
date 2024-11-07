const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signIn', (req, res) => {
    res.sendFile(path.join(__dirname, 'signIn.html'));
});

app.get('/postList', (req, res) => {
    res.sendFile(path.join(__dirname, 'postList.html'));
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
