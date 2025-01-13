import api from '../api.js';
import { IMG_URL } from '../config.js';

const addBtn = document.getElementById('addBtn');

addBtn.addEventListener('click', () => {
    window.location.href = `/addPost`;
});

const root = document.documentElement; // <html> 요소를 참조
const yellow = getComputedStyle(root).getPropertyValue('--yellow');
const darkOrange = getComputedStyle(root).getPropertyValue('--light-green');
const orange = getComputedStyle(root).getPropertyValue('--light-orange');
const green = getComputedStyle(root).getPropertyValue('--light-sky-blue');
const skyBlue = getComputedStyle(root).getPropertyValue('--error');

const colors = [yellow, darkOrange, orange, green];

const postList = document.getElementById('postList');

let currentPage = 1;
const pageSize = 12;
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

        data.forEach((post, index) => {
            const postArticle = document.createElement('article');
            postArticle.classList.add('post');

            const borderColor = colors[index % 4];

            postArticle.style.borderTop = `1px solid ${borderColor}`;
            postArticle.innerHTML = `
            <div class="postContainer">
                <div class="postContentContainer">
                    <div>
                        <div class="writer">
                            <img src="${post.profile_image ? IMG_URL + post.profile_image : '../../assets/IMG_1533.JPG'}" class="writerImg" />
                            <div>
                                <p id="writerText">${post.nickname}</p>
                                <p class="contentSub" style="margin-left: 10px">${formatDates(post.date)}</p>              
                            </div>
                        </div>
                        <div>
                            <div class="contentTitle">${post.title.length > 26 ? post.title.slice(0, 26) : post.title}</div>
                            <div class="contentContent">${post.content}</div>
                        </div>
                    </div>
                    <div class="contentSubTotal" >
                        <div class="contentSubNum">
                            <p class="contentSub">좋아요&nbsp;</p>
                            <p class="contentSub">${formatLikes(post.heart_cnt)}&nbsp;&nbsp;</p>
                            <p class="contentSub">댓글&nbsp;</p>
                            <p class="contentSub">${formatLikes(post.comment_cnt)}&nbsp;&nbsp;</p>
                            <p class="contentSub">조회수&nbsp;</p>
                            <p class="contentSub">${formatLikes(post.visit_cnt)}&nbsp;&nbsp;</p>
                        </div>
                    </div>
                </div>
                <img 
                    src="${post.post_image !== null ? IMG_URL + post.post_image : '../../assets/IMG_1533.JPG'}" 
                    class="postImg" 
                    style="visibility: ${post.post_image === null ? 'hidden' : 'visible'}"
                />

                </div>
               
            `;
            postList.appendChild(postArticle);
            // postArticle.addEventListener('click', () => {
            //     window.location.href = `/posts/${post.post_id}`;
            // });

            const contentTitle = postArticle.querySelector('.contentTitle');
            const contentContent = postArticle.querySelector('.contentContent');
            const postImg = postArticle.querySelector('.postImg');

            [contentTitle, contentContent, postImg].forEach(element => {
                if (element) {
                    element.addEventListener('click', () => {
                        window.location.href = `/posts/${post.post_id}`;
                    });
                }
            });

            const postProfileImg = postArticle.querySelector('.writerImg');
            postProfileImg.onerror = () => {
                postProfileImg.src = '../../assets/IMG_1533.JPG';
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

function truncateText(container, maxLines) {
    const lineHeight = parseFloat(getComputedStyle(container).lineHeight);
    const maxHeight = lineHeight * maxLines;

    while (container.scrollHeight > maxHeight) {
        container.textContent = container.textContent.slice(0, -1).trim();
    }
    container.textContent += '...';
}
