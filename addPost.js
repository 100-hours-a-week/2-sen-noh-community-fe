const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const title = document.getElementById('titleTextArea');
const content = document.getElementById('contentTextArea');
const editFinBtn = document.getElementById('editFinBtn');

title.addEventListener('input', checkInput);
content.addEventListener('input', checkInput);

function checkInput() {
    if (title.value !== '' && content.value !== '') {
        editFinBtn.style.backgroundColor = '#7f6aee';
    } else {
        editFinBtn.style.backgroundColor = '#aca0eb'; // 기본 색으로 되돌리기
    }
}

const helpText = document.getElementsByClassName('helpText')[0];

editFinBtn.addEventListener('click', () => {
    if (title.value == '' || content.value == '') {
        helpText.textContent = '*제목, 내용을 모두 작성해주세요';
        helpText.style.color = '#ff0000';
    } else {
        helpText.style.color = '#f4f5f7';
    }
    console.log('h');
});
