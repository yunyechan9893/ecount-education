import { MemberController as Member, TokenController as Token } from "../common/controllers.js";
import { EventType } from "../common/enum.js"
import { ViewFinder } from "./signupMapping.js";


document.addEventListener(EventType.DOMContentLoaded, () => {
    init();
    eventListener();
})

function init() {
    if (Token.exist()) {
        const path = "/sales/inquiry"
        moveMainPage(path);
    }
}

function eventListener() {

    ViewFinder.button.submit.addEventListener(EventType.click, () => {
        const company = ViewFinder.textbox.company.value;
        const username = ViewFinder.textbox.username.value;
        const email = ViewFinder.textbox.email.value;
        const password = ViewFinder.textbox.password.value;
        const confirmPassword = ViewFinder.textbox.confirmPassword.value;

        if (password.length < 5) {
            alert("비밀번호는 5자 이상이어야 합니다.")
            return;
        }

        if (password != confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.")
            return;
        } 
        
        const isRegistrated = Member.create(company, username, email, password);
        
        if(!isRegistrated) {
            alert("이메일이 중복됐습니다.");
            return;
        }

        const path = "/login"
        moveMainPage(path)
    })
}

function moveMainPage(path) {
    const url = window.location.origin;
    location.href = url + path;
}