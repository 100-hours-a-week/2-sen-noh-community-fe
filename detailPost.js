import api from './api.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    document.location.href = 'postList.html';
});

const postId = new URLSearchParams(window.location.search).get('postId');
const commentCnt = document.getElementsByClassName('nums')[2];

getPost();

async function getPost() {
    try {
        const res = await api.get(`/posts/${postId}`);
        const { data } = res.data;
        const profileImg = document.getElementsByClassName('writerImg')[0];
        document.getElementById('title').textContent = `${data.title}`;
        if (data.profile_image) {
            profileImg.src = `${data.profile_image}`;
        }
        document.getElementById('writerText').textContent = `${data.nickname}`;
        document.getElementById('writeDate').textContent =
            `${formatDates(data.date)}`;
        document.getElementById('contentText').textContent = `${data.content}1`;
        document.getElementsByClassName('nums')[0].textContent =
            `${formatLikes(data.heart_cnt)}`;
        document.getElementsByClassName('nums')[1].textContent =
            `${formatLikes(data.visit_cnt)}`;
        commentCnt.textContent = `${formatLikes(data.comment_cnt)}`;

        profileImg.onerror = () => {
            profileImg.src = './images/IMG_1533.JPG';
        };

        if (data.post_image) {
            const imgElement = document.createElement('img');
            imgElement.src = data.post_image;
            imgElement.alt = '게시글 이미지';
            imgElement.id = 'contentImg';
            document.getElementById('imgContainer').appendChild(imgElement);
        }

        if (data.is_user) {
            const postBtnContainer =
                document.getElementById('postBtnContainer');

            // 수정 버튼 생성
            const editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.id = 'postEditBtn';
            editBtn.textContent = '수정';
            postBtnContainer.appendChild(editBtn);

            // 삭제 버튼 생성
            const delBtn = document.createElement('button');
            delBtn.classList.add('editBtn');
            delBtn.id = 'postDelBtn';
            delBtn.textContent = '삭제';
            postBtnContainer.appendChild(delBtn);

            editBtn.addEventListener('click', () => {
                const imgSrc = `${data.post_image}`;
                const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
                window.location.href = `editPost.html?postId=${postId}&title=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.content)}&img=${fileName}`;
            });

            delBtn.addEventListener('click', () => {
                modal.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
            });
        }

        const likeBtn = document.getElementById('likeBtn');
        if (data.is_liked) {
            likeBtn.style.backgroundColor = '#aca0eb';
        }

        likeBtn.addEventListener('click', async () => {
            const success = await likeApi(data.is_liked);
            if (success) {
                data.is_liked = !data.is_liked;
                data.heart_cnt += data.is_liked ? 1 : -1;
                if (data.is_liked) {
                    likeBtn.style.backgroundColor = '#aca0eb';
                } else {
                    likeBtn.style.backgroundColor = '#d9d9d9';
                }
                document.getElementsByClassName('nums')[0].textContent =
                    `${formatLikes(data.heart_cnt)}`;
            }
        });

        getComment();
    } catch (err) {
        console.error('axios 오류:', err);
    }
}

function formatLikes(likes) {
    if (likes >= 1000) {
        return `${Math.floor(likes / 100) / 10}k`;
    }
    return likes.toString();
}

function formatDates(date) {
    const d = new Date(date);
    return d.toLocaleString('ja-JP').replaceAll('/', '-');
}

const commentList = document.getElementById('commentList');

async function getComment() {
    try {
        commentList.innerHTML = '';
        const res = await api.get(`/posts/${postId}/comments`);
        const comments = res.data.data;
        comments.forEach(cmt => {
            const cmtArticle = document.createElement('article');
            cmtArticle.classList.add('introTitle2');
            cmtArticle.classList.add('chatContainer');
            cmtArticle.innerHTML = `
                <div class="introTitle2">
                <img src="${cmt.profile_image ? cmt.profile_image : './images/IMG_1533.JPG'}" class="writerImg"/>
                <div class="content">
                    <div class="chatTop">
                    <p id="writerText" style="background-color: #f4f5f7">
                        ${cmt.nickname}
                    </p>
                    <p class="contentSub backTrans" style="margin-left: 24px">
                        ${formatDates(cmt.date)}
                    </p>
                    </div>
                    <div id="chatText">${cmt.comment}</div>
                </div>
                </div>
                <div style="margin-top: 19px">
                ${
                    cmt.is_user
                        ? `
                    <button class="editBtn" id="cmtEditBtn_${cmt.comment_id}">수정</button>
                    <button class="editBtn" id="cmtDelBtn_${cmt.comment_id}">삭제</button>`
                        : ``
                }
                </div>
            `;
            commentList.appendChild(cmtArticle);
            if (cmt.is_user) {
                cmtDelModal(cmt.comment_id);
                cmtEdit(cmt);
            }
            const cmtImg = cmtArticle.querySelector('.writerImg');

            cmtImg.onerror = () => {
                cmtImg.src = './images/IMG_1533.JPG';
            };
        });
    } catch (err) {
        console.error('Fetch 오류:', err);
    }
}

//게시글 모달
const modal = document.getElementsByClassName('modalContainer')[0];

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
        deletePostApi();
    });

const cmtInput = document.getElementById('chatInput');
const cmtBtn = document.getElementById('addCmtBtn');

cmtInput.addEventListener('input', () => {
    if (cmtInput.value.trim() !== '') {
        cmtBtn.style.backgroundColor = '#7f6aee';
    } else {
        cmtBtn.style.backgroundColor = '#aca0eb';
    }
});

let commentId;

cmtBtn.addEventListener('click', () => {
    if (cmtInput.value.trim() !== '') {
        const data = {
            comment: cmtInput.value,
        };
        if (cmtBtn.textContent === '댓글 수정') {
            updateCommentApi(data);
        } else {
            addCommentApi(data);
        }
    }
});

//댓글 모달
function cmtDelModal(cmdId) {
    const cmtModal = document.getElementsByClassName('modalContainer')[1];

    document
        .getElementById(`cmtDelBtn_${cmdId}`)
        .addEventListener('click', () => {
            cmtModal.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';

            document.getElementsByClassName('modalBtnYes')[1].addEventListener(
                'click',
                () => {
                    cmtModal.style.visibility = 'hidden';
                    document.body.style.overflow = 'auto';
                    deleteCommentApi(cmdId);
                },
                { once: true },
            );

            document
                .getElementsByClassName('modalBtnNo')[1]
                .addEventListener('click', () => {
                    cmtModal.style.visibility = 'hidden';
                    document.body.style.overflow = 'auto';
                });
        });
}

function cmtEdit(cmt) {
    document
        .getElementById(`cmtEditBtn_${cmt.comment_id}`)
        .addEventListener('click', () => {
            cmtInput.value = cmt.comment;
            cmtBtn.textContent = '댓글 수정';
            commentId = cmt.comment_id;
            cmtBtn.style.backgroundColor = '#7f6aee';
        });
}

async function deletePostApi() {
    try {
        await api.delete(`/posts/${postId}`);

        window.location.href = `postList.html`;
    } catch (err) {
        console.error(err);
    }
}

async function updateCommentApi(data) {
    try {
        await api.patch(`/posts/${postId}/comments/${commentId}`, data);

        cmtInput.value = '';
        cmtBtn.style.backgroundColor = '#aca0eb';
        cmtBtn.textContent = '댓글 작성';
        getComment();
    } catch (err) {
        console.error(err);
    }
}

async function addCommentApi(data) {
    try {
        await api.post(`/posts/${postId}/comments`, data);

        cmtInput.value = '';
        cmtBtn.style.backgroundColor = '#aca0eb';
        commentCnt.textContent = parseInt(commentCnt.textContent, 10) + 1;
        getComment();
    } catch (err) {
        console.error(err);
    }
}

async function deleteCommentApi(delCmtId) {
    try {
        await api.delete(`/posts/${postId}/comments/${delCmtId}`);

        commentCnt.textContent = parseInt(commentCnt.textContent, 10) - 1;
        getComment();
    } catch (err) {
        console.error(err);
    }
}

async function likeApi(isLiked) {
    try {
        if (isLiked) {
            const res = await api.delete(`/posts/${postId}/like`);
            return res.data.success;
        }
        const res = await api.post(`/posts/${postId}/like`);
        return res.data.success;
    } catch (err) {
        console.error(err);
        return false;
    }
}
