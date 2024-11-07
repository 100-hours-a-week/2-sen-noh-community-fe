const nickname = document.getElementById('nickNameInput');
const editBtn = document.getElementById('loginBtn');
const helpText = document.getElementsByClassName('helpText')[0];
const toast = document.getElementById('editFinBtn');

let isSuccess = true;
editBtn.addEventListener('click', () => {
    if (nickname.value == '') {
        helpText.textContent = '*닉네임을 입력해주세요.';
        helpText.style.visibility = 'visible';
    }
    if (nickname.value.length > 11) {
        helpText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        helpText.style.visibility = 'visible';
    }
    if (isSuccess) {
        toast.style.visibility = 'visible';
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 1000);
    }
});
