const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const body = urlParams.get('body');
const img = urlParams.get('img');
const postId = urlParams.get('postId');

document.getElementById('titleTextArea').value =
    title.length > 26 ? title.slice(0, 26) : title;
document.getElementById('contentTextArea').value = body;
document.getElementById('fileName').textContent = img;

const editFinBtn = document.getElementById('editFinBtn');
editFinBtn.addEventListener('click', () => {
    const data = {
        title: document.getElementById('titleTextArea').value,
        content: document.getElementById('contentTextArea').value,
    };
    editPostApi(data);
});

function editPostApi(data) {
    axios
        .patch(`http://localhost:3000/posts/${postId}`, data, {
            withCredentials: true,
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                document.location.href = `detailPost.html?postId=${postId}`;
            }
        })
        .catch(err => console.log(err));
}
