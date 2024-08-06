import { ItemController } from "./controllers.js";
import { messageTag } from "./enum.js"

const CREATE_TYPE = 'CREATE';
const MODIFICAION_TYPE = 'MODIFICATION';
let actionStatus = CREATE_TYPE;
let pageStatus;


document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;
    if (path === '/item/modification') {
        const deleteButton = document.querySelector('#delete');
        const codeTextBox = document.querySelector('#item-code')
    
        deleteButton.hidden = false;
        codeTextBox.disabled = true;

        actionStatus = MODIFICAION_TYPE
    }

    // URL에서 쿼리 파라미터를 가져옵니다.
    const queryParams = new URLSearchParams(window.location.search);

    // 'code'와 'name' 쿼리 파라미터를 가져옵니다.
    const itemCode = queryParams.get('code');
    const itemName = queryParams.get('name');
    pageStatus = queryParams.get('page');

    if (itemCode) {
        document.getElementById('item-code').value = itemCode;
    }

    if (itemName) {
        document.getElementById('item-name').value = itemName;
    }
});

const itemController = new ItemController()

const savingButton = document.querySelector('#save')
savingButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (itemCode.value.length < 1 || itemName.value.length < 1) {
        console.log('품목코드 혹은 품목명을 확인해주세요')
        return;
    }

    if (actionStatus === MODIFICAION_TYPE) {
        const isAlter = itemController.alter(itemCode.value, itemName.value)

        if (!isAlter) {
            console.log('품목 코드가 올바르지 않습니다');
            return;
        }

        excuteRefreshClose()
        return
    } 
    
    const isPushed = itemController.push(itemCode.value, itemName.value)

    if (!isPushed) {
        console.log('품목 코드가 중복됩니다');
        return;
    }

    excuteRefreshClose()
    

})

const deleteButton = document.querySelector('#delete')
deleteButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (itemCode.value.length < 1 || itemName.value.length < 1) {
        console.log('품목코드 혹은 품목명을 확인해주세요')
        return;
    }

    const isDeleted = itemController.delete(itemCode.value)

    if (!isDeleted) {
        console.log('품목이 없습니다')
        return;
    }

    excuteRefreshClose()
})

const rewriteButton = document.querySelector('#rewrite')
rewriteButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    itemCode.value = ''
    itemName.value = ''
})

const closeButton = document.querySelector('#close')
closeButton.addEventListener('click', () => {
    window.close()
})

function excuteRefreshClose() {
    const message = {
        type: messageTag.ITEM_INQUIRY,
        page: pageStatus
    };

    window.opener.postMessage(message, '*');
    window.close()
}
