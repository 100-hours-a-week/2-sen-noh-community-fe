document.getElementById("back").onclick = function () {
  document.location.href = "login.html";
};
document.getElementById("signInText").onclick = function () {
  document.location.href = "login.html";
};

const inputs = document.getElementsByClassName("emailInput");
const isPerfect = [false, false, false, false];

const signInBtn = document.getElementById("loginBtn");

function handleBlur(inputIndex, helpTextFunction, helpTextId) {
  inputs[inputIndex].addEventListener("blur", () => {
    const help = document.getElementById(helpTextId);
    const text = helpTextFunction(inputs[inputIndex].value);
    if (text != "") {
      help.textContent = text;
      help.style.visibility = "visible";
      isPerfect[inputIndex] = false;
      signInBtn.style.backgroundColor = "#aca0eb";
    } else {
      help.style.visibility = "hidden";
      isPerfect[inputIndex] = true;
      if (isPerfect.every((i) => i === true)) {
        signInBtn.style.backgroundColor = "#7f6aee";
        signInBtn.addEventListener("click", () => {
          document.location.href = "login.html";
        });
      } else {
        signInBtn.style.backgroundColor = "#aca0eb";
      }
    }
  });
}

handleBlur(0, emailHelp, "helpText1");
handleBlur(1, pwHelp, "helpText2");
handleBlur(2, rePwHelp, "helpText3");
handleBlur(3, nickNameHelp, "helpText4");

const emails = "example@example.com";

function emailHelp(email) {
  if (email == "") {
    return "*이메일을 입력해주세요.";
  }
  if (!validEmail(email)) {
    return "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
  }
  if (email == emails) {
    return "*중복된 이메일 입니다. ";
  }
  return "";
}

function validEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function pwHelp(pw) {
  if (pw == "") {
    return "*비밀번호를 입력해주세요.";
  }
  if (!validPW(pw)) {
    return "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }
  //   if (pw != inputs[2].value) {
  //     return "*비밀번호가 다릅니다. ";
  //   }
  return "";
}

function validPW(pw) {
  const regex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
  return regex.test(pw);
}

function rePwHelp(pw) {
  if (pw == "") {
    return "*비밀번호를 한번더 입력해주세요.";
  }
  if (pw != inputs[1].value) {
    return "*비밀번호가 다릅니다. ";
  }
  return "";
}

const names = "sen";

function nickNameHelp(name) {
  if (name == "") {
    return "*닉네임을 입력해주세요.";
  }
  if (/\s/.test(name)) {
    return "*띄어쓰기를 없애주세요";
  }
  if (name == names) {
    return "*중복된 닉네임입니다.";
  }
  if (name.length > 10) {
    return "*닉네임은 최대 10자 까지 작성 가능합니다.";
  }
  return "";
}
