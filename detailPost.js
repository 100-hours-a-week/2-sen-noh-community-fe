const backBtn = document.getElementById("back");

backBtn.addEventListener("click", () => {
  history.back();
});

const postId = new URLSearchParams(window.location.search).get("postId");

const editBtn = document.getElementById("postEditBtn");

const imgSrc = document.getElementById("contentImg").src;

const fileName = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);

fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("title").textContent = `${data.title}`;
    document.getElementById("writerText").textContent =
      `더미 작성자 ${data.userId}`;
    document.getElementById("contentText").textContent = `${data.body}`;
    document.getElementsByClassName("nums")[0].textContent =
      `${formatLikes(data.body.length * 10)}`;
    document.getElementsByClassName("nums")[2].textContent =
      `${formatLikes(data.body.length)}`;
    document.getElementsByClassName("nums")[1].textContent =
      `${formatLikes(data.body.length * 100)}`;
    editBtn.addEventListener("click", () => {
      document.location.href = `editPost.html?title=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.body)}&img=${fileName}`;
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

const modal = document.getElementsByClassName("modalContainer")[0];

document.getElementById("postDelBtn").addEventListener("click", () => {
  modal.style.visibility = "visible";
  document.body.style.overflow = "hidden";
});

document
  .getElementsByClassName("modalBtnNo")[0]
  .addEventListener("click", () => {
    modal.style.visibility = "hidden";
    document.body.style.overflow = "auto";
  });

document
  .getElementsByClassName("modalBtnYes")[0]
  .addEventListener("click", () => {
    modal.style.visibility = "hidden";
    document.body.style.overflow = "auto";
    document.location.href = "postList.html";
  });

const cmtInput = document.getElementById("chatInput");
const cmtBtn = document.getElementById("addCmtBtn");

cmtInput.addEventListener("input", () => {
  if (cmtInput.value.trim() != "") {
    cmtBtn.style.backgroundColor = "#7f6aee";
  } else {
    cmtBtn.style.backgroundColor = "#aca0eb";
  }
});
