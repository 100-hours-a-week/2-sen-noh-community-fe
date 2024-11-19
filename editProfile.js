const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');

editBtn.addEventListener('click', () => {
    if (nickname.value === '') {
        helpText.textContent = '*닉네임을 입력해주세요.';
        helpText.style.visibility = 'visible';
    } else if (nickname.value.length > 11) {
        helpText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        helpText.style.visibility = 'visible';
    } else {
        const data = {
            nickname: nickname.value,
        };
        editProfile(data);
    }
});

// TODO - userId 가져오기
axios
    .get(`http://localhost:3000/users/1`)
    .then(res => {
        const userInfo = res.data.data;
        document.getElementById('userEmail').textContent = userInfo.email;
        document.getElementById('nickNameInput').value = userInfo.nickname;
    })
    .catch(err => console.error(err));

// TODO - userId 추가
function editProfile(data) {
    axios
        .patch('http://localhost:3000/users/1/userInfo', data)
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

// TODO - userId 추가
function deleteUser() {
    axios
        .delete('http://localhost:3000/users/4')
        .then(res => {
            if (res.status === 200) {
                document.location.href = `login.html`;
            }
        })
        .catch(err => {
            console.error(err);
        });
}
