import { ItemController } from "./controllers.js";

const path = window.location.pathname;

if (path === '/item/modification') {
    const deleteButton = document.querySelector('#delete');
    const codeTextBox = document.querySelector('#item-code')

    deleteButton.hidden = false;
    codeTextBox.disabled = true;
}


const itemController = new ItemController()

const savingButton = document.querySelector('#save')
savingButton.addEventListener('click', () => {
    const itemCode = document.querySelector('#item-code');
    const itemName = document.querySelector('#item-name');

    if (itemCode.value.length < 1 || itemName.value.length < 1) {
        console.log('품목코드 혹은 품목명을 확인해주세요')
        return;
    }

    const isPushed = itemController.push(itemCode.value, itemName.value)

    if (!isPushed) {
        console.log('품목 코드가 중복됩니다');
        return;
    }

    window.close()
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

    window.close()
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