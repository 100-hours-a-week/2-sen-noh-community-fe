const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", () => {
  document.location.href = "addPost.html";
});

const postList = document.getElementById("postList");

let posts = [];

fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => response.json())
  .then((data) => {
    posts = data; // 데이터 할당
    posts.forEach((post) => {
      const postArticle = document.createElement("article");
      postArticle.classList.add("post");
      postArticle.innerHTML = `
        <div class="contentTitle">${post.title.length > 26 ? post.title.slice(0, 26) : post.title}</div>
        <div class="contentSubTotal">
          <div class="contentSubNum">
            <p class="contentSub">좋아요&nbsp;</p>
            <p class="contentSub">${formatLikes(post.body.length * 10)}&nbsp;&nbsp;</p>
            <p class="contentSub">댓글&nbsp;</p>
            <p class="contentSub">${post.body.length}&nbsp;&nbsp;</p>
            <p class="contentSub">조회수&nbsp;</p>
            <p class="contentSub">${formatLikes(post.body.length * 100)}&nbsp;&nbsp;</p>
          </div>
          <p class="contentSub" style="padding-right: 24px">2021-01-01 00:00:00</p>
        </div>
        <div class="writer">
          <img src="./images/IMG_1533.JPG" class="writerImg" />
          <p id="writerText">더미 작성자 ${post.userId}</p>
        </div>
      `;
      postList.appendChild(postArticle);
      postArticle.addEventListener("click", () => {
        document.location.href = `detailPost.html?postId = ${post.id}}`;
      });
    });
  })
  .catch((error) => console.error("Fetch 오류:", error));

function formatLikes(likes) {
  if (likes >= 1000) {
    return Math.floor(likes / 100) / 10 + "k";
  } else {
    return likes.toString();
  }
}
