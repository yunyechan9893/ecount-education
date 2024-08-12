import { ItemController } from "../common/controllers.js";
import { PageStatus, CurrentItem } from "./itemRegistrationControllers.js";
import { messageTag, EventType } from "../common/enum.js"
import { ViewFinder } from "./itemRegistrationMapping.js";

const MODIFICATION_PATH = '/item/modification';

document.addEventListener(EventType.DOMContentLoaded, () => {

    const path = window.location.pathname;
    if (path === MODIFICATION_PATH) {
        // URL에서 쿼리 파라미터를 가져옵니다.
        const queryParams = new URLSearchParams(window.location.search);

        // 'code'와 'name' 쿼리 파라미터를 가져옵니다.
        const itemCode = queryParams.get('code');
        const itemName = queryParams.get('name');

        CurrentItem.set(itemCode, itemName);

        if (itemCode) {
            ViewFinder.textbox.itemCode.value = itemCode;
        }

        if (itemName) {
            ViewFinder.textbox.itemName.value = itemName;
        }
        
        const deleteButton = ViewFinder.button.delete;
        const codeTextBox  = ViewFinder.textbox.itemCode
    
        deleteButton.hidden = false;
        codeTextBox.disabled = true;

        PageStatus.setModification();
    }
});

const itemController = new ItemController()

ViewFinder.button.save.addEventListener(EventType.click, () => {
    const itemCode = ViewFinder.textbox.itemCode;
    const itemName = ViewFinder.textbox.itemName;

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

const deleteButton = ViewFinder.button.delete
deleteButton.addEventListener(EventType.click, () => {
    const itemCode = ViewFinder.textbox.itemCode;
    const itemName = ViewFinder.textbox.itemName;

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

const rewriteButton = ViewFinder.button.rewrite
rewriteButton.addEventListener(EventType.click, () => {
    const itemCode = ViewFinder.textbox.itemCode;
    const itemName = ViewFinder.textbox.itemName;

    if (PageStatus.checkModificationStatus()) {
        itemCode.value = CurrentItem.get().code;
        itemName.value = CurrentItem.get().name;

        return;
    }
    
    itemCode.value = ''
    itemName.value = ''
})

ViewFinder.button.close.addEventListener(EventType.click, () => {
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
