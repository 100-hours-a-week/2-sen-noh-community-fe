const backBtn = document.getElementById("back");

backBtn.addEventListener("click", () => {
  history.back();
});

const postId = new URLSearchParams(window.location.search).get("postId");

const editBtn = document.getElementById("postEditBtn");

fetch(`posts.json`)
  .then((response) => response.json())
  .then((posts) => {
    data = posts[`${postId}` - 1];
    document.getElementById("title").textContent = `${data.title}`;
    document.getElementById("writerText").textContent = `${data.nickname}`;
    document.getElementById("writeDate").textContent =
      `${formatDates(data.date)}`;
    document.getElementById("contentText").textContent = `${data.content}`;
    document.getElementsByClassName("nums")[0].textContent =
      `${formatLikes(data.heart_cnt)}`;
    document.getElementsByClassName("nums")[2].textContent =
      `${formatLikes(data.visit_cnt)}`;
    document.getElementsByClassName("nums")[1].textContent =
      `${formatLikes(data.chat_cnt)}`;
    editBtn.addEventListener("click", () => {
      const imgSrc = `${data.post_image}`;
      const fileName = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);
      document.location.href = `editPost.html?title=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.content)}&img=${fileName}`;
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

function formatDates(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
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
