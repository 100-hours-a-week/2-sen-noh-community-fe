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
    document.location.href = 'editProfile.html';
});
menu[1].addEventListener('click', () => {
    document.location.href = 'editPW.html';
});
menu[2].addEventListener('click', () => {
    sessionStorage.clear();
    document.location.href = 'login.html';
});

const profileImgStorage = sessionStorage.getItem('profileImg');

if (profileImgStorage !== 'null') {
    profileImg.src = profileImgStorage;
}

const userId = parseInt(sessionStorage.getItem('userId'), 10);
