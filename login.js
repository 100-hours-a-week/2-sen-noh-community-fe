const inputs = document.getElementsByClassName("emailInput");
const loginBtn = document.getElementById("loginBtn");
const helpText = document.getElementById("helpText");

const pw = "Aaaa123@";
loginBtn.addEventListener("click", () => {
  const text = outputText();
  if (text != "") {
    helpText.textContent = text;
    helpText.style.visibility = "visible";
  } else {
    loginBtn.style.backgroundColor = "#7f6aee";
  }
});

function outputText() {
  if (!validEmail(inputs[0].value)) {
    return "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  }
  if (inputs[1].value == "") {
    return "* 비밀번호를 입력해주세요.";
  }
  if (!validPW(inputs[1].value)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }
  if (inputs[1].value != pw) {
    return "* 비밀번호가 다릅니다.";
  }
  return "";
}

function validEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validPW(pw) {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
  return regex.test(pw);
}
