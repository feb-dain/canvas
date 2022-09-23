let modalC = document.querySelector(".cancel-modal")

const modalCInner = document.createElement("div");
modalCInner.classList = "modal-inner";

const modalCMessage = document.createElement("p");
modalCMessage.innerText = "정말 초기화 하시겠습니까?";

const btnY = document.createElement("button");
btnY.innerText = "확인";
const btnN = document.createElement("button");
btnN.innerText = "취소";

modalCInner.appendChild(modalCMessage);
modalCInner.appendChild(btnY);
modalCInner.appendChild(btnN);
modalC.appendChild(modalCInner);