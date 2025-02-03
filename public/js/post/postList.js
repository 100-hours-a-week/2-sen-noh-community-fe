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

            const postContainer = document.createElement('div');
            postContainer.classList.add('postContainer');

            const postContentContainer = document.createElement('div');
            postContentContainer.classList.add('postContentContainer');

            const topContainer = document.createElement('div');

            const writer = document.createElement('div');
            writer.classList.add('writer');
            const writerImg = document.createElement('img');
            writerImg.src = post.profile_image
                ? IMG_URL + post.profile_image
                : '../../assets/IMG_1533.JPG';
            writerImg.classList.add('writerImg');
            writer.appendChild(writerImg);

            const writerTextContainer = document.createElement('div');
            const writerText = document.createElement('p');
            writerText.id = 'writerText';
            writerText.textContent = post.nickname;
            writerTextContainer.appendChild(writerText);

            const dateText = document.createElement('p');
            dateText.classList.add('contentSub');
            dateText.style.marginLeft = '10px';
            dateText.textContent = formatDates(post.date);
            writerTextContainer.appendChild(dateText);

            writer.appendChild(writerTextContainer);

            topContainer.appendChild(writer);

            const postContent = document.createElement('div');

            const contentTitle = document.createElement('div');
            contentTitle.classList.add('contentTitle');
            contentTitle.textContent =
                post.title.length > 26 ? post.title.slice(0, 26) : post.title;
            postContent.appendChild(contentTitle);

            const contentContent = document.createElement('div');
            contentContent.classList.add('contentContent');
            contentContent.textContent = post.content;
            postContent.appendChild(contentContent);

            const contentSubTotal = document.createElement('div');
            contentSubTotal.classList.add('contentSubTotal');

            const contentSubNum = document.createElement('div');
            contentSubNum.classList.add('contentSubNum');

            const likeText = document.createElement('p');
            likeText.classList.add('contentSub');
            likeText.textContent = `좋아요 ${formatLikes(post.heart_cnt)}`;
            likeText.appendChild(document.createTextNode('\u00A0\u00A0'));
            contentSubNum.appendChild(likeText);

            const commentText = document.createElement('p');
            commentText.classList.add('contentSub');
            commentText.textContent = `댓글 ${formatLikes(post.comment_cnt)}`;
            commentText.appendChild(document.createTextNode('\u00A0\u00A0'));
            contentSubNum.appendChild(commentText);

            const visitText = document.createElement('p');
            visitText.classList.add('contentSub');
            visitText.textContent = `조회수 ${formatLikes(post.visit_cnt)}`;
            contentSubNum.appendChild(visitText);

            contentSubTotal.appendChild(contentSubNum);

            topContainer.appendChild(postContent);

            postContentContainer.appendChild(topContainer);
            postContentContainer.appendChild(contentSubTotal);

            const postImage = document.createElement('img');
            postImage.classList.add('postImg');
            postImage.src =
                post.post_image !== null
                    ? IMG_URL + post.post_image
                    : '../../assets/IMG_1533.JPG';
            postImage.style.visibility =
                post.post_image === null ? 'hidden' : 'visible';

            [contentTitle, contentContent, postImage].forEach(element => {
                if (element) {
                    element.addEventListener('click', () => {
                        window.location.href = `/posts/${post.post_id}`;
                    });
                }
            });

            writerImg.onerror = () => {
                writerImg.src = '../../assets/IMG_1533.JPG';
            };

            postContainer.appendChild(postContentContainer);
            postContainer.appendChild(postImage);

            postArticle.appendChild(postContainer);

            postList.appendChild(postArticle);
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
