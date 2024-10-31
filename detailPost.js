const backBtn = document.getElementById("back");

backBtn.addEventListener("click", () => {
  document.location.href = "postList.html";
});

const postId = new URLSearchParams(window.location.search).get("postId");

const editBtn = document.getElementsByClassName("editBtn")[0];

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
