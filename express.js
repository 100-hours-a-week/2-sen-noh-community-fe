import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(express.static(join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'login.html'));
});

app.get('/signIn', (req, res) => {
    res.sendFile(join(__dirname, 'signIn.html'));
});

app.get('/postList', (req, res) => {
    res.sendFile(join(__dirname, 'postList.html'));
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});