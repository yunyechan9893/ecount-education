import { MemberController as Member, TokenController } from "../common/controllers.js";
import { EventType } from "../common/enum.js"
import { ViewFinder } from "./loginMapping.js";


document.addEventListener(EventType.DOMContentLoaded, () => {
    eventListener();
})

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

        TokenController.create();
        const url = "http://localhost:3000"
        const path = "/sales/inquiry"
        location.href = url + path;
    })
}