import api from './api.js';

document.getElementById('back').onclick = function () {
    document.location.href = 'login.html';
};
document.getElementById('signInText').onclick = function () {
    document.location.href = 'login.html';
};

const inputs = document.getElementsByClassName('emailInput');
const isPerfect = [false, false, false, false];

const signInBtn = document.getElementById('loginBtn');

function handleBlur(inputIndex, helpTextFunction, helpTextId) {
    inputs[inputIndex].addEventListener('blur', async () => {
        const help = document.getElementById(helpTextId);
        const text = await helpTextFunction(inputs[inputIndex].value);
        if (text !== '') {
            help.textContent = text;
            help.style.visibility = 'visible';
            isPerfect[inputIndex] = false;
            signInBtn.style.backgroundColor = '#aca0eb';
        } else {
            help.style.visibility = 'hidden';
            isPerfect[inputIndex] = true;
            if (isPerfect.every(i => i === true)) {
                signInBtn.style.backgroundColor = '#7f6aee';

                signInBtn.addEventListener('click', () => {
                    signIn();
                });
            } else {
                signInBtn.style.backgroundColor = '#aca0eb';
            }
        }
    });
}

handleBlur(0, emailHelp, 'helpText1');
handleBlur(1, pwHelp, 'helpText2');
handleBlur(2, rePwHelp, 'helpText3');
handleBlur(3, nickNameHelp, 'helpText4');

async function emailHelp(email) {
    if (email == '') {
        return '*이메일을 입력해주세요.';
    }
    if (!validEmail(email)) {
        return '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    }
    if (await existEmail({ email })) {
        return '*중복된 이메일 입니다. ';
    }
    return '';
}

function validEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function pwHelp(pw) {
    if (pw == '') {
        return '*비밀번호를 입력해주세요.';
    }
    if (!validPW(pw)) {
        return '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    return '';
}

function validPW(pw) {
    const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    return regex.test(pw);
}

function rePwHelp(pw) {
    if (pw == '') {
        return '*비밀번호를 한번더 입력해주세요.';
    }
    if (pw != inputs[1].value) {
        return '*비밀번호가 다릅니다. ';
    }
    return '';
}

async function nickNameHelp(name) {
    if (name === '') {
        return '*닉네임을 입력해주세요.';
    }
    if (/\s/.test(name)) {
        return '*띄어쓰기를 없애주세요';
    }
    if (name.length > 10) {
        return '*닉네임은 최대 10자 까지 작성 가능합니다.';
    }
    if (await existNickname({ nickname: name })) {
        return '*중복된 닉네임입니다.';
    }
    return '';
}

const imageUpload = document.getElementById('imageUpload');
const imagePlus = document.getElementById('imagePlus');
const profilePreview = document.getElementById('profilePreview');

imagePlus.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', event => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            profilePreview.src = e.target.result;
            profilePreview.style.visibility = 'visible';
        };
        reader.readAsDataURL(file);
    }
});

async function signIn() {
    const formData = new FormData();
    formData.append('email', inputs[0].value);
    formData.append('password', inputs[1].value);
    formData.append('nickname', inputs[3].value);
    formData.append('profile_image', imageUpload.files[0]);
    try {
        await api.post('/auth/signIn', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        window.location.href = 'login.html';
    } catch (err) {
        console.error(err);
    }
}

async function existEmail(data) {
    try {
        const res = await api.post('/auth/checkEmail', data);
        return res.data.data.is_existed;
    } catch (err) {
        console.error(err);
        return true;
    }
}

async function existNickname(data) {
    try {
        const res = await api.post('auth/checkNickname', data);
        return res.data.data.is_existed;
    } catch (err) {
        console.error(err);
        return true;
    }
}
