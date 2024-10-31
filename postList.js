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
        <div class="contentTitle">제목 1</div>
        <div class="contentSubTotal">
          <div class="contentSubNum">
            <p class="contentSub">좋아요&nbsp;</p>
            <p class="contentSub">0</p>
          </div>
          <div class="contentSubNum">
            <p class="contentSub">댓글&nbsp;</p>
            <p class="contentSub">0</p>
          </div>
          <div class="contentSubNum">
            <p class="contentSub">조회수&nbsp;</p>
            <p class="contentSub">0</p>
          </div>
          <p class="contentSub" style="padding-right: 24px">2021-01-01 00:00:00</p>
        </div>
        <div class="writer">
          <img src="./images/IMG_1533.JPG" id="writerImg" />
          <p id="writerText">더미 작성자 1</p>
        </div>
      `;
      postList.appendChild(postArticle);
    });
  })
  .catch((error) => console.error("Fetch 오류:", error));
