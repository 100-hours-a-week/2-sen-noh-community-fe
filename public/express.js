import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/auth/login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/auth/login.html'));
});

app.get('/signIn', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/auth/signIn.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/post/postList.html'));
});

app.get('/addPost', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/post/addPost.html'));
});

app.get('/posts/:postId', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/post/detailPost.html'));
});

app.get('/editPost/:postId', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/post/editPost.html'));
});

app.get('/editProfile', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/user/editProfile.html'));
});

app.get('/editPW', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/user/editPW.html'));
});

app.listen(port, () => {
    console.log(`서버가 실행 중입니다.`);
});
