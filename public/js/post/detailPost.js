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
        document.getElementById('contentText').textContent = `${data.content}`;
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
                window.location.href = `/editPost/${data.post_id}`;
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
            cmtArticle.classList.add('introTitle2', 'chatContainer');

            const writerContainer = document.createElement('div');
            writerContainer.classList.add('introTitle2');

            const writerImg = document.createElement('img');
            writerImg.src = cmt.profile_image
                ? IMG_URL + cmt.profile_image
                : '../../assets/IMG_1533.JPG';
            writerImg.classList.add('writerImg');
            writerContainer.appendChild(writerImg);

            const contentContainer = document.createElement('div');
            contentContainer.classList.add('content');

            const chatTop = document.createElement('div');
            chatTop.classList.add('chatTop');

            const writerText = document.createElement('p');
            writerText.id = 'writerText';
            writerText.textContent = cmt.nickname;
            chatTop.appendChild(writerText);

            const dateText = document.createElement('p');
            dateText.classList.add('contentSub', 'backTrans');
            dateText.style.marginLeft = '24px';
            dateText.textContent = formatDates(cmt.date);
            chatTop.appendChild(dateText);

            contentContainer.appendChild(chatTop);

            const chatText = document.createElement('div');
            chatText.id = 'chatText';
            chatText.textContent = cmt.comment;
            contentContainer.appendChild(chatText);

            writerContainer.appendChild(contentContainer);

            const actionsContainer = document.createElement('div');
            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.style.marginTop = '0px';

            if (cmt.is_user) {
                const ellipsisImg = document.createElement('img');
                ellipsisImg.src = '../../assets/ellipsis.svg';
                ellipsisImg.classList.add('ellipsis');
                dropdownWrapper.appendChild(ellipsisImg);
                actionsContainer.appendChild(dropdownWrapper);
            }

            const dropdownContainer = document.createElement('div');
            dropdownContainer.classList.add('chatDropDownContainer');
            dropdownContainer.id = `dropdown_${cmt.comment_id}`;

            const dropdownMenu = document.createElement('div');
            dropdownMenu.id = 'chatDropDown';

            if (cmt.is_user) {
                const editBtn = document.createElement('button');
                editBtn.classList.add('editBtn');
                editBtn.id = `cmtEditBtn_${cmt.comment_id}`;
                editBtn.textContent = '수정';

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('editBtn');
                deleteBtn.id = `cmtDelBtn_${cmt.comment_id}`;
                deleteBtn.textContent = '삭제';

                dropdownMenu.appendChild(editBtn);
                dropdownMenu.appendChild(deleteBtn);
            }

            dropdownContainer.appendChild(dropdownMenu);
            actionsContainer.appendChild(dropdownContainer);

            cmtArticle.appendChild(writerContainer);
            cmtArticle.appendChild(actionsContainer);
            commentList.appendChild(cmtArticle);

            // 이벤트 리스너 설정
            writerImg.onerror = () => {
                writerImg.src = '../../assets/IMG_1533.JPG';
            };

            if (cmt.is_user) {
                cmtDelModal(cmt.comment_id);
                cmtEdit(cmt);

                const ellipsis = cmtArticle.querySelector('.ellipsis');

                if (ellipsis) {
                    ellipsis.addEventListener('click', event => {
                        event.stopPropagation();
                        const allDropdowns = document.querySelectorAll(
                            '.chatDropDownContainer',
                        );
                        allDropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdownContainer) {
                                otherDropdown.style.display = 'none';
                            }
                        });

                        dropdownContainer.style.display =
                            dropdownContainer.style.display === 'block'
                                ? 'none'
                                : 'block';
                    });
                }
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
        alert('서버 오류');
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
        alert('서버 오류');
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
        alert('서버 오류');
    }
}

async function deleteCommentApi(delCmtId) {
    try {
        await api.delete(`/posts/${postId}/comments/${delCmtId}`);

        commentCnt.textContent = parseInt(commentCnt.textContent, 10) - 1;
        getComment();
    } catch (err) {
        console.error(err);
        alert('서버 오류');
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
