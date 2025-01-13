import api from '../api.js';
import { IMG_URL } from '../config.js';

const backBtn = document.getElementById('back');

backBtn.addEventListener('click', () => {
    document.location.href = '/posts';
});

const pathSegments = window.location.pathname.split('/');
const postId = pathSegments[pathSegments.length - 1];
const commentCnt = document.getElementsByClassName('nums')[2];

const root = document.documentElement; // <html> 요소를 참조
const darkOrange = getComputedStyle(root).getPropertyValue('--dark-orange');
const orange = getComputedStyle(root).getPropertyValue('--orange');

getPost();

async function getPost() {
    try {
        const res = await api.get(`/posts/${postId}`);
        const { data } = res.data;
        const profileImg = document.getElementsByClassName('writerImg')[0];
        document.getElementById('title').textContent = `${data.title}`;
        if (data.profile_image) {
            profileImg.src = `${IMG_URL}${data.profile_image}`;
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
            profileImg.src = '../../assets/IMG_1533.JPG';
        };

        if (data.post_image) {
            const imgElement = document.createElement('img');
            imgElement.src = IMG_URL + data.post_image;
            imgElement.alt = '게시글 이미지';
            imgElement.id = 'contentImg';
            document.getElementById('imgContainer').appendChild(imgElement);
        }

        if (data.is_user) {
            const postBtnContainer =
                document.getElementById('postBtnContainer');

            // 수정 버튼 생성
            const editBtn = document.createElement('button');
            editBtn.classList.add('editPostBtn');
            editBtn.id = 'postEditBtn';
            editBtn.textContent = '수정';
            postBtnContainer.appendChild(editBtn);

            // 삭제 버튼 생성
            const delBtn = document.createElement('button');
            delBtn.classList.add('editPostBtn');
            delBtn.id = 'postDelBtn';
            delBtn.textContent = '삭제';
            postBtnContainer.appendChild(delBtn);

            editBtn.addEventListener('click', () => {
                const imgSrc = `${data.post_image}`;
                const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
                window.location.href = `/editPost?postId=${postId}&title=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.content)}&img=${fileName}`;
            });

            delBtn.addEventListener('click', () => {
                modal.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
            });
        }

        const likeImg = document.getElementsByClassName('cntImg')[0];
        const likeBtn = document.getElementById('likeBtn');
        if (data.is_liked) {
            likeImg.src = '../../assets/fillHeart.svg';
        }

        likeBtn.addEventListener('click', async () => {
            const success = await likeApi(data.is_liked);
            if (success) {
                data.is_liked = !data.is_liked;
                data.heart_cnt += data.is_liked ? 1 : -1;
                if (data.is_liked) {
                    likeImg.src = '../../assets/fillHeart.svg';
                } else {
                    likeImg.src = '../../assets/heart.svg';
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

const chatWriterImg = document.getElementById('chatWriterImg');
chatWriterImg.src = sessionStorage.getItem('profileImg');

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
                    <img src="${cmt.profile_image ? IMG_URL + cmt.profile_image : '../../assets/IMG_1533.JPG'}" class="writerImg"/>
                    <div class="content">
                        <div class="chatTop">
                        <p id="writerText" >
                            ${cmt.nickname}
                        </p>
                        <p class="contentSub backTrans" style="margin-left: 24px">
                            ${formatDates(cmt.date)}
                        </p>
                        </div>
                        <div id="chatText">${cmt.comment}</div>
                    </div>
                </div>
                <div>
                
                <div style="margin-top: 0px">
                ${
                    cmt.is_user
                        ? `<img src="../../assets/ellipsis.svg" class = "ellipsis"/>`
                        : ``
                }
                </div>
                <div class="chatDropDownContainer" id="dropdown_${cmt.comment_id}">
                    <div id="chatDropDown">
                         <button class="editBtn" id="cmtEditBtn_${cmt.comment_id}">수정</button>
                        <button class="editBtn" id="cmtDelBtn_${cmt.comment_id}">삭제</button>
                    </div>
                </div>
                </div>
            </div>
            `;
            commentList.appendChild(cmtArticle);
            if (cmt.is_user) {
                cmtDelModal(cmt.comment_id);
                cmtEdit(cmt);
            }
            const cmtImg = cmtArticle.querySelector('.writerImg');

            cmtImg.onerror = () => {
                cmtImg.src = '../../assets/IMG_1533.JPG';
            };

            const ellipsis = cmtArticle.querySelector('.ellipsis');
            const dropdown = cmtArticle.querySelector('.chatDropDownContainer');

            if (ellipsis) {
                ellipsis.addEventListener('click', event => {
                    event.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지
                    // 모든 드롭다운을 닫고, 클릭한 드롭다운을 열기
                    const allDropdowns = document.querySelectorAll(
                        '.chatDropDownContainer',
                    );
                    allDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.style.display = 'none'; // 다른 드롭다운 닫기
                        }
                    });

                    // 클릭한 드롭다운 열기/닫기
                    if (
                        dropdown.style.display === 'none' ||
                        !dropdown.style.display
                    ) {
                        dropdown.style.display = 'block';
                    } else {
                        dropdown.style.display = 'none';
                    }
                });
            }
        });
    } catch (err) {
        console.error('Fetch 오류:', err);
    }
}

document.addEventListener('click', event => {
    const allDropdowns = document.querySelectorAll('.chatDropDownContainer');

    allDropdowns.forEach(dropdown => {
        if (
            !dropdown.contains(event.target) &&
            !event.target.classList.contains('ellipsis')
        ) {
            dropdown.style.display = 'none';
        }
    });
});

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
const cmtBtn2 = document.getElementById('addCmtBtn2');

cmtInput.addEventListener('input', () => {
    if (cmtInput.value.trim() !== '') {
        cmtBtn.style.backgroundColor = darkOrange;
    } else {
        cmtBtn.style.backgroundColor = orange;
    }
});

cmtBtn2.addEventListener('click', () => {
    cmtInput.value = '';
    cmtBtn.style.backgroundColor = orange;
    cmtBtn.textContent = '댓글';
});

let commentId;

cmtBtn.addEventListener('click', () => {
    if (cmtInput.value.trim() !== '') {
        const data = {
            comment: cmtInput.value,
        };
        if (cmtBtn.textContent === '수정') {
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
            cmtBtn.textContent = '수정';
            commentId = cmt.comment_id;
            cmtBtn.style.backgroundColor = darkOrange;
        });
}

async function deletePostApi() {
    try {
        await api.delete(`/posts/${postId}`);

        window.location.href = `/posts`;
    } catch (err) {
        console.error(err);
    }
}

async function updateCommentApi(data) {
    try {
        await api.patch(`/posts/${postId}/comments/${commentId}`, data);

        cmtInput.value = '';
        cmtBtn.style.backgroundColor = orange;
        cmtBtn.textContent = '댓글';
        getComment();
    } catch (err) {
        console.error(err);
    }
}

async function addCommentApi(data) {
    try {
        await api.post(`/posts/${postId}/comments`, data);

        cmtInput.value = '';
        cmtBtn.style.backgroundColor = orange;
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

const chatInput = document.getElementById('chatInput');

// 자동 높이 조정 이벤트
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto'; // 높이를 초기화하여 정확히 계산
    chatInput.style.height = chatInput.scrollHeight + 'px'; // 내용 높이에 맞게 조정
});
