const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    history.back();
});

const postId = new URLSearchParams(window.location.search).get('postId');

const editBtn = document.getElementById('postEditBtn');

fetch(`posts.json`)
    .then(response => response.json())
    .then(posts => {
        data = posts[`${postId}` - 1];
        document.getElementById('title').textContent = `${data.title}`;
        document.getElementById('writerText').textContent = `${data.nickname}`;
        document.getElementById('writeDate').textContent =
            `${formatDates(data.date)}`;
        document.getElementById('contentText').textContent = `${data.content}`;
        document.getElementsByClassName('nums')[0].textContent =
            `${formatLikes(data.heart_cnt)}`;
        document.getElementsByClassName('nums')[2].textContent =
            `${formatLikes(data.visit_cnt)}`;
        document.getElementsByClassName('nums')[1].textContent =
            `${formatLikes(data.chat_cnt)}`;
        editBtn.addEventListener('click', () => {
            const imgSrc = `${data.post_image}`;
            const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
            document.location.href = `editPost.html?title=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.content)}&img=${fileName}`;
        });
    })
    .catch(error => console.error('Fetch 오류:', error));

function formatLikes(likes) {
    if (likes >= 1000) {
        return Math.floor(likes / 100) / 10 + 'k';
    } else {
        return likes.toString();
    }
}

function formatDates(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

const commentList = document.getElementById('commentList');

fetch('comments.json')
    .then(res => res.json())
    .then(data => {
        comments = data.filter(cmt => cmt.post_id == postId);
        comments.forEach(cmt => {
            const cmtArticle = document.createElement('article');
            cmtArticle.classList.add('introTitle2');
            cmtArticle.classList.add('chatContainer');
            cmtArticle.innerHTML = `
            <div class="introTitle2">
              <img src="./images/IMG_1533.JPG" class="writerImg" />
              <div class="content">
                <div class="chatTop">
                  <p id="writerText" style="background-color: #f4f5f7">
                    ${cmt.nickname}
                  </p>
                  <p class="contentSub backTrans" style="margin-left: 24px">
                    ${formatDates(cmt.date)}
                  </p>
                </div>
                <p id="chatText">${cmt.comment}</p>
              </div>
            </div>
            <div style="margin-top: 19px">
              <button class="editBtn" id="cmtEditBtn_${cmt.comment_id}">수정</button>
              <button class="editBtn" id="cmtDelBtn_${cmt.comment_id}">삭제</button>
            </div>
      `;
            commentList.appendChild(cmtArticle);
            cmtDelModal(cmt.comment_id);
            cmtEdit(cmt);
        });
    })
    .catch(error => console.error('Fetch 오류:', error));

//게시글 모달
const modal = document.getElementsByClassName('modalContainer')[0];

document.getElementById('postDelBtn').addEventListener('click', () => {
    modal.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
});

document
    .getElementsByClassName('modalBtnNo')[0]
    .addEventListener('click', () => {
        modal.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
    });

document
    .getElementsByClassName('modalBtnYes')[0]
    .addEventListener('click', () => {
        modal.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
        document.location.href = 'postList.html';
    });

const cmtInput = document.getElementById('chatInput');
const cmtBtn = document.getElementById('addCmtBtn');

cmtInput.addEventListener('input', () => {
    if (cmtInput.value.trim() != '') {
        cmtBtn.style.backgroundColor = '#7f6aee';
    } else {
        cmtBtn.style.backgroundColor = '#aca0eb';
    }
});

//댓글 모달
function cmtDelModal(commentId) {
    const cmtModal = document.getElementsByClassName('modalContainer')[1];

    document
        .getElementById(`cmtDelBtn_${commentId}`)
        .addEventListener('click', () => {
            cmtModal.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            console.log(`${commentId}`);
        });

    document
        .getElementsByClassName('modalBtnNo')[1]
        .addEventListener('click', () => {
            cmtModal.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        });

    document
        .getElementsByClassName('modalBtnYes')[1]
        .addEventListener('click', () => {
            cmtModal.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        });
}

function cmtEdit(cmt) {
    document
        .getElementById(`cmtEditBtn_${cmt.comment_id}`)
        .addEventListener('click', () => {
            cmtInput.value = cmt.comment;
            cmtBtn.textContent = '댓글 수정';
            cmtBtn.style.backgroundColor = '#7f6aee';
        });
}
