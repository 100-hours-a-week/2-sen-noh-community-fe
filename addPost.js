const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const title = document.getElementById('titleTextArea');
const content = document.getElementById('contentTextArea');
const addFinBtn = document.getElementById('editFinBtn');

title.addEventListener('input', checkInput);
content.addEventListener('input', checkInput);

function checkInput() {
    if (title.value !== '' && content.value !== '') {
        addFinBtn.style.backgroundColor = '#7f6aee';
    } else {
        addFinBtn.style.backgroundColor = '#aca0eb'; // 기본 색으로 되돌리기
    }
}

const helpText = document.getElementsByClassName('helpText')[0];

addFinBtn.addEventListener('click', () => {
    if (title.value == '' || content.value == '') {
        helpText.textContent = '*제목, 내용을 모두 작성해주세요';
        helpText.style.color = '#ff0000';
    } else {
        helpText.style.color = '#f4f5f7';

        const data = {
            title: title.value,
            content: content.value,
            user_id: parseInt(userId, 10),
        };
        addPostApi(data);
    }
});

function addPostApi(data) {
    axios
        .post('http://localhost:3000/posts', data)
        .then(res => {
            if (res.status === 201) {
                const postId = res.data.postId;
                // console.log(res.data);
                document.location.href = `detailPost.html?postId=${postId}`;
            }
        })
        .catch(err => console.error(err));
}
