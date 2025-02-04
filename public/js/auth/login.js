import api from '../api.js';
import { IMG_URL } from '../config.js';

const inputs = document.getElementsByClassName('emailInput');
const loginBtn = document.getElementById('loginBtn');
const helpText = document.getElementById('helpText');

const root = document.documentElement; // <html> 요소를 참조
const orange = getComputedStyle(root).getPropertyValue('--orange');
const darkOrange = getComputedStyle(root).getPropertyValue('--dark-orange');

let emailText;
let pwText;

inputs[0].addEventListener('blur', () => {
    emailText = outputEmailText();
    if (emailText !== '') {
        helpText.textContent = emailText;
        helpText.style.visibility = 'visible';
        loginBtn.style.backgroundColor = orange;
    } else if (pwText === '') {
        loginBtn.style.backgroundColor = darkOrange;
        helpText.style.visibility = 'hidden';
    }
});

inputs[1].addEventListener('blur', () => {
    pwText = outputPWText();
    if (pwText !== '') {
        helpText.textContent = pwText;
        helpText.style.visibility = 'visible';
        loginBtn.style.backgroundColor = orange;
    } else if (emailText === '') {
        loginBtn.style.backgroundColor = darkOrange;
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
    document.location.href = '/signIn';
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
        console.log(res.data.data);
        if (res.data.data.profile_image) {
            sessionStorage.setItem(
                'profileImg',
                IMG_URL + res.data.data.profile_image,
            );
        }

        document.location.href = `/posts`;
    } catch (err) {
        loginBtn.style.backgroundColor = orange;
        helpText.textContent = '* ' + err.response.data.message;
        helpText.style.visibility = 'visible';
    }
}
