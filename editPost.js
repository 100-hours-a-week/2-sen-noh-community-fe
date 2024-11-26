import api from './api.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const body = urlParams.get('body');
const img = urlParams.get('img');
const postId = urlParams.get('postId');

document.getElementById('titleTextArea').value =
    title.length > 26 ? title.slice(0, 26) : title;
document.getElementById('contentTextArea').value = body;
document.getElementById('fileName').textContent = img;

const editFinBtn = document.getElementById('editFinBtn');
editFinBtn.addEventListener('click', () => {
    const data = {
        title: document.getElementById('titleTextArea').value,
        content: document.getElementById('contentTextArea').value,
    };
    editPostApi(data);
});

async function editPostApi(data) {
    try {
        const res = await api.patch(`/posts/${postId}`, data);
        if (res.status === 200) {
            window.location.href = `detailPost.html?postId=${postId}`;
        }
    } catch (err) {
        console.error(err);
    }
}
