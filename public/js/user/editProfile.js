import api from '../api.js';
import { IMG_URL } from '../config.js';

const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');

const profileImgStorage = sessionStorage.getItem('profileImg');

let originNickname;

editBtn.addEventListener('click', async () => {
    if (nickname.value === '') {
        helpText.textContent = '*닉네임을 입력해주세요.';
        helpText.style.visibility = 'visible';
    } else if (nickname.value.length > 11) {
        helpText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        helpText.style.visibility = 'visible';
    } else if (
        nickname.value !== originNickname &&
        (await existNickname({ nickname: nickname.value }))
    ) {
        helpText.textContent = '*중복된 닉네임 입니다.';
        helpText.style.visibility = 'visible';
    } else {
        editBtn.style.backgroundColor = '#7F6AEE';
        editProfile();
    }
});

nickname.addEventListener('input', () => {
    if (nickname.value !== originNickname) {
        editBtn.style.backgroundColor = '#7F6AEE';
    } else {
        editBtn.style.backgroundColor = '#ACA0EB';
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

        if (profileImgStorage !== 'null') {
            document.getElementById('profileImg').src = profileImgStorage;
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
});

imageUpload.addEventListener('change', event => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            editBtn.style.backgroundColor = '#7F6AEE';
            profilePreview.src = e.target.result;
            profilePreview.style.visibility = 'visible';
        };
        reader.readAsDataURL(file);
    }
});

async function editProfile() {
    const formData = new FormData();

    if (nickname.value !== originNickname) {
        formData.append('nickname', nickname.value);
    }
    formData.append('profile_image', imageUpload.files[0]);

    try {
        const res = await api.patch(`/users/userInfo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.style.visibility = 'visible';
        editBtn.style.backgroundColor = '#ACA0EB';
        if (res.data.img) {
            sessionStorage.setItem('profileImg', IMG_URL + res.data.img);
            const profileImg = document.getElementById('profile');
            profileImg.src = IMG_URL + res.data.img;
        }
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
