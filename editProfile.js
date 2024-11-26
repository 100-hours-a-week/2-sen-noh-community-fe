const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');
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

axios
    .get(`http://localhost:3000/users/${userId}`, {
        withCredentials: true,
    })
    .then(res => {
        const userInfo = res.data.data;
        document.getElementById('userEmail').textContent = userInfo.email;
        document.getElementById('nickNameInput').value = userInfo.nickname;

        if (profileImgStorage !== 'null') {
            document.getElementById('profileImg').src = profileImgStorage;
        }
    })
    .catch(err => console.error(err));

function editProfile(data) {
    axios
        .patch(`http://localhost:3000/users/${userId}/userInfo`, data, {
            withCredentials: true,
        })
        .then(res => {
            toast.style.visibility = 'visible';
            setTimeout(() => {
                toast.style.visibility = 'hidden';
            }, 1000);
        })
        .catch(err => console.error(err));
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

function deleteUser() {
    axios
        .delete(`http://localhost:3000/users/${userId}`, {
            withCredentials: true,
        })
        .then(res => {
            if (res.status === 200) {
                document.location.href = `login.html`;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

async function existNickname(data) {
    try {
        const res = await axios.post(
            'http://localhost:3000/auth/checkNickname',
            data,
            {
                withCredentials: true,
            },
        );
        return res.data.data.is_existed; // 서버에서 받은 값을 반환
    } catch (err) {
        console.error(err);
        return true; // 기본값으로 true 반환 (중복된 이메일로 처리)
    }
}
