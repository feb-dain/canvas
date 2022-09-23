let modal = document.querySelector(".modal")

const modalInner = document.createElement("div");
modalInner.classList = "modal-inner";

const modalMessage = document.createElement("p");
modalMessage.innerText = "숫자(양수)를 입력하세요.";
modalMessage.classList = "modalM1";
const modalMessage2 = document.createElement("p");
modalMessage2.classList = "modalM2";
modalMessage2.innerText = "터치 스크린에서는 사용할 수 없습니다.";

const modalBtn = document.createElement("button");
modalBtn.innerText = "확인";

modalInner.appendChild(modalMessage);
modalInner.appendChild(modalMessage2);
modalInner.appendChild(modalBtn);
modal.appendChild(modalInner);

function clickedModal(){
    modal.classList.add("hidden")
}

modalBtn.addEventListener("click", clickedModal);