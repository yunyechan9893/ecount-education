import { ItemController } from "./controllers.js";

const path = window.location.pathname;

if (path === '/modification') {
    
}

function openPopup(url) {
    window.open(url, '_blank', 'width=600,height=400'); // 팝업 창 열기
}

openPopup('/item/registration')
