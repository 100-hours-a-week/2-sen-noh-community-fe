import api from './api.js';

const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');

const profileImgStorage = sessionStorage.getItem('profileImg');

editBtn.addEventListener('click', async () => {
    if (nickname.value === '') {
        helpText.textContent = '*닉네임을 입력해주세요.';
        helpText.style.visibility = 'visible';
    } else if (nickname.value.length > 11) {
        helpText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        helpText.style.visibility = 'visible';
    } else if (await existNickname({ nickname: nickname.value })) {
        helpText.textContent = '*중복된 닉네임 입니다.';
        helpText.style.visibility = 'visible';
    } else {
        const data = {
            nickname: nickname.value,
        };
        editProfile(data);
    }
});

getUser();

async function getUser() {
    try {
        const res = await api.get('/users/');
        const userInfo = res.data.data;
        document.getElementById('userEmail').textContent = userInfo.email;
        document.getElementById('nickNameInput').value = userInfo.nickname;

        if (profileImgStorage !== 'null') {
            document.getElementById('profileImg').src = profileImgStorage;
        }
    } catch (err) {
        console.error(err);
    }
}

async function editProfile(data) {
    try {
        await api.patch(`/users/userInfo`, data);
        toast.style.visibility = 'visible';
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
        window.location.href = `login.html`;
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
