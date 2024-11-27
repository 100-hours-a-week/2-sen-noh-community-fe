import api from './api.js';

const inputs = document.getElementsByClassName('emailInput');
const loginBtn = document.getElementById('loginBtn');
const helpText = document.getElementById('helpText');

let emailText;
let pwText;

inputs[0].addEventListener('blur', () => {
    emailText = outputEmailText();
    if (emailText !== '') {
        helpText.textContent = emailText;
        helpText.style.visibility = 'visible';
        loginBtn.style.backgroundColor = '#ACA0EB';
    } else if (pwText === '') {
        loginBtn.style.backgroundColor = '#7f6aee';
        helpText.style.visibility = 'hidden';
    }
});

inputs[1].addEventListener('blur', () => {
    pwText = outputPWText();
    if (pwText !== '') {
        helpText.textContent = pwText;
        helpText.style.visibility = 'visible';
        loginBtn.style.backgroundColor = '#ACA0EB';
    } else if (emailText === '') {
        loginBtn.style.backgroundColor = '#7f6aee';
        helpText.style.visibility = 'hidden';
    }
});

loginBtn.addEventListener('click', () => {
    if (pwText === '' && emailText === '') {
        const data = {
            email: inputs[0].value,
            password: inputs[1].value,
        };
        login(data);
    }
});

document.getElementById('signInText').onclick = function () {
    document.location.href = 'signIn.html';
};

function outputEmailText() {
    if (!validEmail(inputs[0].value)) {
        return '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    }
    return '';
}

function outputPWText() {
    if (inputs[1].value === '') {
        return '* 비밀번호를 입력해주세요.';
    }
    if (!validPW(inputs[1].value)) {
        return '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    return '';
}

function validEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function validPW(pw) {
    const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    return regex.test(pw);
}

async function login(data) {
    try {
        const res = await api.post('/auth/login', data);
        helpText.style.visibility = 'hidden';
        sessionStorage.setItem('userId', res.data.data.user_id);
        sessionStorage.setItem(
            'profileImg',
            `http://localhost:3000/${res.data.data.profile_image}`,
        );

        if (res.status === 201) {
            document.location.href = `postList.html`;
        }
    } catch (err) {
        loginBtn.style.backgroundColor = '#ACA0EB';
        helpText.textContent = '* ' + err.response.data.message;
        helpText.style.visibility = 'visible';
    }
}
