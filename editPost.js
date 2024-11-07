const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get('title');
const body = urlParams.get('body');
const img = urlParams.get('img');

document.getElementById('titleTextArea').value =
    title.length > 26 ? title.slice(0, 26) : title;
document.getElementById('contentTextArea').value = body;
document.getElementById('fileName').textContent = img;
