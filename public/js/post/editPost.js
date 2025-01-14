import api from '../api.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

// const urlParams = new URLSearchParams(window.location.search);
let title = '';
let body = '';
// const img = decodeURIComponent(urlParams.get('img'));
// const postId = urlParams.get('postId');

const pathSegments = window.location.pathname.split('/');
const postId = pathSegments[pathSegments.length - 1];

const root = document.documentElement;
const darkOrange = getComputedStyle(root).getPropertyValue('--dark-orange');
const orange = getComputedStyle(root).getPropertyValue('--orange');

getPost();

async function getPost() {
    try {
        const res = await api.get(`/posts/edit/${postId}`);
        const { data } = res.data;
        title = data.title;
        body = data.content;
        document.getElementById('titleTextArea').value =
            data.title.length > 26 ? data.title.slice(0, 26) : data.title;
        document.getElementById('contentTextArea').value = data.content;
        document.getElementById('fileName').textContent =
            data.post_image !== 'null' ? data.post_image.substring(8) : '';
    } catch (err) {
        console.error('axios 오류:', err);
    }
}

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
        editFinBtn.style.backgroundColor = darkOrange;
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
        window.location.href = `/posts/${postId}`;
    } catch (err) {
        console.error(err);
    }
}

newTitle.addEventListener('input', () => {
    if (newTitle.value !== title || newContent.value !== body) {
        editFinBtn.style.backgroundColor = darkOrange;
    } else {
        editFinBtn.style.backgroundColor = orange;
    }
});

newContent.addEventListener('input', () => {
    if (newTitle.value !== title || newContent.value !== body) {
        editFinBtn.style.backgroundColor = darkOrange;
    } else {
        editFinBtn.style.backgroundColor = orange;
    }
});
