const inputs = document.getElementsByClassName('emailInput');
const helpPW = document.getElementById('helpText2');
const helpRePW = document.getElementById('helpText3');
const finBtn = document.getElementById('loginBtn');
const toast = document.getElementById('editFinBtn');
let isSuccess = true;

inputs[0].addEventListener('blur', () => {
    if (inputs[0].value == '') {
        helpPW.style.visibility = 'visible';
        helpPW.textContent = '*비밀번호를 입력해주세요.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else if (!validPW(inputs[0].value)) {
        helpPW.style.visibility = 'visible';
        helpPW.textContent =
            '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else if (inputs[0].value != inputs[1].value) {
        helpPW.style.visibility = 'visible';
        helpPW.textContent = '*비밀번호 확인과 다릅니다.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else {
        helpPW.style.visibility = 'hidden';
        helpRePW.style.visibility = 'hidden';
        finBtn.style.backgroundColor = '#7f6aee';
        isSuccess = true;
    }
});

inputs[1].addEventListener('blur', () => {
    if (inputs[1].value == '') {
        helpRePW.style.visibility = 'visible';
        helpRePW.textContent = '*비밀번호를 입력해주세요.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else if (inputs[0].value != inputs[1].value) {
        helpRePW.style.visibility = 'visible';
        helpRePW.textContent = '*비밀번호 확인과 다릅니다.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else if (!validPW(inputs[0].value)) {
        helpPW.style.visibility = 'visible';
        helpPW.textContent =
            '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        finBtn.style.backgroundColor = '#aca0eb';
        isSuccess = false;
    } else {
        helpPW.style.visibility = 'hidden';
        helpRePW.style.visibility = 'hidden';
        finBtn.style.backgroundColor = '#7f6aee';
        isSuccess = true;
    }
});

function validPW(pw) {
    const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    return regex.test(pw);
}

finBtn.addEventListener('click', () => {
    if (isSuccess) {
        toast.style.visibility = 'visible';
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 1000);
    }
});
