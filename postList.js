import api from './api.js';

const addBtn = document.getElementById('addBtn');

addBtn.addEventListener('click', () => {
    window.location.href = `addPost.html`;
});

const postList = document.getElementById('postList');

let currentPage = 1;
const pageSize = 10;
let isLoading = false;
let hasMore = true;

async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await api.get(
            `/posts?page=${currentPage}&size=${pageSize}`,
        );
        const { data, meta } = res.data;

        data.forEach(post => {
            const postArticle = document.createElement('article');
            postArticle.classList.add('post');
            postArticle.innerHTML = `
                <div class="contentTitle">${post.title.length > 26 ? post.title.slice(0, 26) : post.title}</div>
                <div class="contentSubTotal">
                    <div class="contentSubNum">
                        <p class="contentSub">좋아요&nbsp;</p>
                        <p class="contentSub">${formatLikes(post.heart_cnt)}&nbsp;&nbsp;</p>
                        <p class="contentSub">댓글&nbsp;</p>
                        <p class="contentSub">${formatLikes(post.comment_cnt)}&nbsp;&nbsp;</p>
                        <p class="contentSub">조회수&nbsp;</p>
                        <p class="contentSub">${formatLikes(post.visit_cnt)}&nbsp;&nbsp;</p>
                    </div>
                    <p class="contentSub" style="padding-right: 24px">${formatDates(post.date)}</p>
                </div>
                <div class="writer">
                    <img src="${post.profile_image ? post.profile_image : './images/IMG_1533.JPG'}" class="writerImg" />
                    <p id="writerText">${post.nickname}</p>
                </div>
            `;
            postList.appendChild(postArticle);
            postArticle.addEventListener('click', () => {
                window.location.href = `detailPost.html?postId=${post.post_id}`;
            });
            const postProfileImg = postArticle.querySelector('.writerImg');
            postProfileImg.onerror = () => {
                postProfileImg.src = './images/IMG_1533.JPG';
            };
        });

        currentPage++;
        isLoading = false;
        hasMore = meta.totalItems > meta.currentPage * meta.perPage;
    } catch (err) {
        console.error('Fetch 오류:', err);
        isLoading = false;
    }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadPosts();
    }
});

loadPosts();

function formatLikes(likes) {
    if (likes >= 1000) {
        return Math.floor(likes / 100) / 10 + 'k';
    }
    return likes.toString();
}

function formatDates(date) {
    const d = new Date(date);
    return d.toLocaleString('ja-JP').replaceAll('/', '-');
}
