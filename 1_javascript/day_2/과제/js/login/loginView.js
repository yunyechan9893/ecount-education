import { MemberController as Member, TokenController as Token } from "../common/controllers.js";
import { Urls } from "../common/textCollection.js";
import { EventType } from "../common/enum.js"
import { ViewFinder } from "./loginMapping.js";


document.addEventListener(EventType.DOMContentLoaded, () => {
    init();
    eventListener();
})

function init() {
    if (Token.exist()) {
        moveMainPage();
    }
}

function eventListener() {

    ViewFinder.button.submit.addEventListener(EventType.click, () => {
        const company = ViewFinder.textbox.company.value;
        const username = ViewFinder.textbox.username.value;
        const password = ViewFinder.textbox.password.value;

        if (password.length < 5) {
            alert("비밀번호는 5자 이상이어야 합니다.")
            return;
        }
        
        const isLogin = Member.equls(company, username, password);
        
        if(!isLogin) {
            alert("아이디/비밀번호를 확인해주세요.");
            return;
        }

        Token.create();
        moveMainPage();
    })
}

function moveMainPage() {
    const url = window.location.origin;
    const path = Urls.salesInquiry;

    location.href = url + path;
}