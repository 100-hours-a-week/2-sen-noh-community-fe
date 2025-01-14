import api from './api.js';

const profileImg = document.getElementById('profile');
const menu = document.getElementsByClassName('menu');
const dropDown = document.getElementById('dropDown');

let dropDownVisible = true;

profileImg.addEventListener('click', () => {
    if (dropDownVisible) {
        dropDown.style.visibility = 'visible';
        dropDownVisible = false;
    } else {
        dropDown.style.visibility = 'hidden';
        dropDownVisible = true;
    }
});

menu[0].addEventListener('click', () => {
    document.location.href = '/editProfile';
});
menu[1].addEventListener('click', () => {
    document.location.href = '/editPW';
});
menu[2].addEventListener('click', () => {
    sessionStorage.clear();
    logout();
});

const profileImgStorage = sessionStorage.getItem('profileImg');

if (profileImgStorage !== 'null') {
    profileImg.src = profileImgStorage;
}

profileImg.onerror = () => {
    profileImg.src = '../../assets/IMG_1533.JPG';
};

async function logout() {
    try {
        await api.post(`/users/logout`);
        window.location.href = '/login';
    } catch (err) {
        console.error(err);
    }
}

const headerTitle = document.querySelector('h1');
headerTitle.addEventListener('click', () => {
    window.location.href = '/posts';
});
headerTitle.style.cursor = 'pointer';
