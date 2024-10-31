const backBtn = document.getElementById("back");

backBtn.addEventListener("click", () => {
  history.back();
});

const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get("title");
const body = urlParams.get("body");
const img = urlParams.get("img");

document.getElementsByClassName("editSubTitle")[1].textContent = title;
document.getElementById("contentText").textContent = body;
document.getElementById("fileName").textContent = img;
