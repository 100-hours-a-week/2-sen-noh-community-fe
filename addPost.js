import api from './api.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const title = document.getElementById('titleTextArea');
const content = document.getElementById('contentTextArea');
const addFinBtn = document.getElementById('editFinBtn');

title.addEventListener('input', checkInput);
content.addEventListener('input', checkInput);

function checkInput() {
    if (title.value !== '' && content.value !== '') {
        addFinBtn.style.backgroundColor = '#7f6aee';
    } else {
        addFinBtn.style.backgroundColor = '#aca0eb'; // 기본 색으로 되돌리기
    }
}

const helpText = document.getElementsByClassName('helpText')[0];

addFinBtn.addEventListener('click', () => {
    if (title.value === '' || content.value === '') {
        helpText.textContent = '*제목, 내용을 모두 작성해주세요';
        helpText.style.color = '#ff0000';
    } else {
        helpText.style.color = '#f4f5f7';
        addPostApi();
    }
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

async function addPostApi() {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('post_image', imageUpload.files[0]);
    try {
        const res = await api.post('posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        window.location.href = `detailPost.html?postId=${res.data.postId}`;
    } catch (err) {
        console.error(err);
    }
}
