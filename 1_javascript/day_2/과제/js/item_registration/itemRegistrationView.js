import { ItemController } from "../common/controllers.js";
import { PageStatus, CurrentItem } from "./itemRegistrationControllers.js";
import { messageTag } from "../common/enum.js"

const MODIFICATION_PATH = '/item/modification';

document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;
    if (path === MODIFICATION_PATH) {
        // URL에서 쿼리 파라미터를 가져옵니다.
        const queryParams = new URLSearchParams(window.location.search);

        // 'code'와 'name' 쿼리 파라미터를 가져옵니다.
        const itemCode = queryParams.get('code');
        const itemName = queryParams.get('name');

        CurrentItem.set(itemCode, itemName);

        if (itemCode) {
            document.getElementById('item-code').value = itemCode;
        }

        if (itemName) {
            document.getElementById('item-name').value = itemName;
        }
        
        const deleteButton = document.querySelector('#delete');
        const codeTextBox = document.querySelector('#item-code')
    
        deleteButton.hidden = false;
        codeTextBox.disabled = true;

        PageStatus.setModification();
    }
});

const itemController = new ItemController()

const savingButton = document.querySelector('#save')
savingButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (itemCode.value.length < 1 || itemName.value.length < 1) {
        alert('품목코드 혹은 품목명을 확인해주세요')
        return;
    }

    if (PageStatus.checkModificationStatus()) {
        const isAlter = itemController.alter(itemCode.value, itemName.value)

        if (!isAlter) {
            alert('품목 코드가 올바르지 않습니다');
            return;
        }

        excuteRefreshClose()
        return
    } 
    
    const isPushed = itemController.push(itemCode.value, itemName.value)

    if (!isPushed) {
        alert('품목 코드가 중복됩니다');
        return;
    }

    excuteRefreshClose()
    

})

const deleteButton = document.querySelector('#delete')
deleteButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (itemCode.value.length < 1 || itemName.value.length < 1) {
        alert('품목코드 혹은 품목명을 확인해주세요')
        return;
    }

    const isDeleted = itemController.delete(itemCode.value)

    if (!isDeleted) {
        alert('품목이 없습니다')
        return;
    }

    excuteRefreshClose()
})

const rewriteButton = document.querySelector('#rewrite')
rewriteButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (PageStatus.checkModificationStatus()) {
        itemCode.value = CurrentItem.get().code;
        itemName.value = CurrentItem.get().name;

        return;
    }
    
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
        page: PageStatus.get()
    };

    window.opener.postMessage(message, '*');
    window.close()
}
