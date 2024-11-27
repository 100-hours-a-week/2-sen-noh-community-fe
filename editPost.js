import api from './api.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const body = urlParams.get('body');
const img = decodeURIComponent(urlParams.get('img'));
const postId = urlParams.get('postId');

document.getElementById('titleTextArea').value =
    title.length > 26 ? title.slice(0, 26) : title;
document.getElementById('contentTextArea').value = body;
document.getElementById('fileName').textContent = img;

const editFinBtn = document.getElementById('editFinBtn');
editFinBtn.addEventListener('click', () => {
    editPostApi();
});

const imagePlus = document.getElementById('fileBtn');
const imageUpload = document.getElementById('imageUpload');

imagePlus.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', event => {
    const file = event.target.files[0];

    if (file) {
        document.getElementById('fileName').textContent = file.name;
    }
});

const newTitle = document.getElementById('titleTextArea');
const newContent = document.getElementById('contentTextArea');

async function editPostApi() {
    const formData = new FormData();
    if (newTitle.value !== title) {
        formData.append('title', newTitle.value);
    }
    if (newContent.value !== body) {
        formData.append('content', newContent.value);
    }
    formData.append('post_image', imageUpload.files[0]);
    try {
        await api.patch(`/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        window.location.href = `detailPost.html?postId=${postId}`;
    } catch (err) {
        console.error(err);
    }
}
