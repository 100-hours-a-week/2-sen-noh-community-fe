const addBtn = document.getElementById('addBtn');

addBtn.addEventListener('click', () => {
    document.location.href = 'addPost.html';
});

const postList = document.getElementById('postList');

let posts = [];

fetch('posts.json')
    .then(response => response.json())
    .then(data => {
        posts = data; // 데이터 할당
        posts.forEach(post => {
            const postArticle = document.createElement('article');
            postArticle.classList.add('post');
            postArticle.innerHTML = `
        <div class="contentTitle">${post.title.length > 26 ? post.title.slice(0, 26) : post.title}</div>
        <div class="contentSubTotal">
          <div class="contentSubNum">
            <p class="contentSub">좋아요&nbsp;</p>
            <p class="contentSub">${formatLikes(post.heart_cnt)}&nbsp;&nbsp;</p>
            <p class="contentSub">댓글&nbsp;</p>
            <p class="contentSub">${post.chat_cnt}&nbsp;&nbsp;</p>
            <p class="contentSub">조회수&nbsp;</p>
            <p class="contentSub">${formatLikes(post.visit_cnt)}&nbsp;&nbsp;</p>
          </div>
          <p class="contentSub" style="padding-right: 24px">${formatDates(post.date)}</p>
        </div>
        <div class="writer">
          <img src="./images/IMG_1533.JPG" class="writerImg" />
          <p id="writerText">${post.nickname}</p>
        </div>
      `;
            postList.appendChild(postArticle);
            postArticle.addEventListener('click', () => {
                document.location.href = `detailPost.html?postId=${post.post_id}`;
            });
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
