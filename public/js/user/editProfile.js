import api from '../api.js';
import { IMG_URL } from '../config.js';

const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');

const profileImgStorage = sessionStorage.getItem('profileImg');

const root = document.documentElement;
const darkOrange = getComputedStyle(root).getPropertyValue('--dark-orange');
const orange = getComputedStyle(root).getPropertyValue('--orange');

let originNickname;
let isEdit = false;
let hasImg = false;

editBtn.addEventListener('click', async () => {
    if (!isEdit && nickname.value === originNickname) {
        editBtn.style.backgroundColor = orange;
    } else if (nickname.value === '') {
        helpText.textContent = '*닉네임을 입력해주세요.';
        helpText.style.visibility = 'visible';
        editBtn.style.backgroundColor = orange;
    } else if (nickname.value.length > 11) {
        helpText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        helpText.style.visibility = 'visible';
        editBtn.style.backgroundColor = orange;
    } else if (
        nickname.value !== originNickname &&
        (await existNickname({ nickname: nickname.value }))
    ) {
        helpText.textContent = '*중복된 닉네임 입니다.';
        helpText.style.visibility = 'visible';
        editBtn.style.backgroundColor = orange;
    } else {
        helpText.style.visibility = 'hidden';
        editBtn.style.backgroundColor = darkOrange;
        editProfile();
    }
});

nickname.addEventListener('input', () => {
    if (nickname.value !== originNickname) {
        editBtn.style.backgroundColor = darkOrange;
    } else {
        editBtn.style.backgroundColor = orange;
    }
});

getUser();

async function getUser() {
    try {
        const res = await api.get('/users/');
        const userInfo = res.data.data;
        document.getElementById('userEmail').textContent = userInfo.email;
        nickname.value = userInfo.nickname;
        originNickname = userInfo.nickname;

        if (profileImgStorage) {
            document.getElementById('profileImg').src = profileImgStorage;
            hasImg = true;
        }
    } catch (err) {
        console.error(err);
    }
}

const imageUpload = document.getElementById('imageUpload');
const imagePlus = document.getElementById('editImgBtn');
const profilePreview = document.getElementById('profileImg');

imagePlus.addEventListener('click', () => {
    imageUpload.click();
    imageUpload.value = '';
    profilePreview.src = '';
    if (hasImg) {
        editBtn.style.backgroundColor = darkOrange;
        isEdit = true;
    }
});

profilePreview.addEventListener('click', () => {
    imageUpload.click();
    imageUpload.value = '';
    profilePreview.src = '';
    if (hasImg) {
        editBtn.style.backgroundColor = darkOrange;
        isEdit = true;
    }
});

imageUpload.addEventListener('change', event => {
    const file = event.target.files[0];
    isEdit = true;
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            editBtn.style.backgroundColor = darkOrange;
            profilePreview.src = e.target.result;
            profilePreview.style.visibility = 'visible';
        };
        reader.readAsDataURL(file);
    } else if (!hasImg) {
        isEdit = false;
    }
});

async function editProfile() {
    const formData = new FormData();

    if (nickname.value !== originNickname) {
        formData.append('nickname', nickname.value);
    }

    if (imageUpload.files[0]) {
        formData.append('profile_image', imageUpload.files[0]);
        hasImg = true;
    } else if (isEdit) {
        formData.append('originProfile', true);
        hasImg = false;
    }

    try {
        const res = await api.patch(`/users/userInfo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.style.visibility = 'visible';
        editBtn.style.backgroundColor = orange;

        const profileImg = document.getElementById('profile');
        if (res.data.img) {
            sessionStorage.setItem('profileImg', IMG_URL + res.data.img);
            profileImg.src = IMG_URL + res.data.img;
        } else if (isEdit) {
            sessionStorage.removeItem('profileImg');
            profileImg.src = '';
        }
        isEdit = false;
        originNickname = nickname.value;
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 1000);
    } catch (err) {
        console.error(err);
    }
}

const delBtn = document.getElementById('signInText');
delBtn.addEventListener('click', () => {
    modal.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
});

const modal = document.getElementsByClassName('modalContainer')[0];

document
    .getElementsByClassName('modalBtnNo')[0]
    .addEventListener('click', () => {
        modal.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
    });

document
    .getElementsByClassName('modalBtnYes')[0]
    .addEventListener('click', () => {
        modal.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
        deleteUser();
    });

async function deleteUser() {
    try {
        await api.delete(`/users/`);
        window.location.href = `/login`;
    } catch (err) {
        console.error(err);
    }
}

async function existNickname(data) {
    try {
        const res = await api.post('/auth/checkNickname', data);
        return res.data.data.is_existed;
    } catch (err) {
        console.error(err);
        return true;
    }
}
