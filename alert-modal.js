let modal = document.querySelector(".modal")

const modalInner = document.createElement("div");
modalInner.classList = "modal-inner";

const modalMessage = document.createElement("p");
modalMessage.innerText = "숫자(양수)를 입력하세요.";

const modalBtn = document.createElement("button");
modalBtn.innerText = "확인";

modalInner.appendChild(modalMessage);
modalInner.appendChild(modalBtn);
modal.appendChild(modalInner);

function clickedModal(){
    modal.classList.add("hidden")
}

modalBtn.addEventListener("click", clickedModal);