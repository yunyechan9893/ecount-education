import { SpecificationController } from "./controllers.js";
import { messageTag } from "./enum.js"

const PAGE_LIMIT = 10;
const CREATE_TYPE = 'CREATE';
const MODIFICAION_TYPE = 'MODIFICATION';
let actionStatus = CREATE_TYPE;
const searchedItemList = []

const specificationController = new SpecificationController();

document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;

    if (path === '/sale/modification') {
        const numberTextBox = document.querySelector('#number');
        const codeTextBox = document.querySelector('#item-code')
    
        numberTextBox.hidden = false;
        codeTextBox.disabled = true;

        actionStatus = MODIFICAION_TYPE
    }
    
    eventListener()

    // 화면 리로드 이벤트
    window.addEventListener('message', function(event) {
        
        if (event.data.type === messageTag.SALE_INPUT) {
            
            let itemLabel = ''            
            event.data.search.forEach(data => {
                itemLabel += `<${data.itemCode}(${data.itemName})>`
                searchedItemList.push({itemCode: data.itemCode, itemName: data.itemName})
            });

            const itemTextBox = this.document.querySelector('#keyword')
            itemTextBox.value = itemLabel;
        }
    });
})

function eventListener() {
    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', () => {
        openPopup(`/sales/search?page=10`, 1000, 600)
    })

    const savingButton = document.querySelector('#save')
    savingButton.addEventListener('click', () => {
        const yearSelector = document.querySelector('#year');
        const monthSelector = document.querySelector('#month');
        const daySelector = document.querySelector('#day');

        const selectedYearOption = yearSelector.options[yearSelector.selectedIndex].value;
        const selectedMonthOption = monthSelector.options[monthSelector.selectedIndex].value;
        const selectedDayOption = daySelector.options[daySelector.selectedIndex].value;

        const date = selectedYearOption + "-" + selectedMonthOption + "-" + selectedDayOption;

        const keywordTextBox = document.querySelector('#keyword');
        const quantityTextBox = document.querySelector('#quantity');
        const priceTextBox = document.querySelector('#price');
        const briefsTextBox = document.querySelector('#briefs');

        if (selectedYearOption == null && selectedYearOption == '') {
            alert('연도를 입력하세요')
            return
        } else if (selectedMonthOption == null && selectedMonthOption == '' ) {
            alert('월을 입력하세요') 
            return
        } else if (selectedDayOption == null && selectedDayOption == '' ) {
            alert('일을 입력하세요') 
            return
        } if (keywordTextBox.value.trim() === '') {
            alert('품목을 입력하세요');
            return;
        } else if (quantityTextBox.value.trim() === '') {
            alert('수량을 입력하세요');
            return;
        } else if (priceTextBox.value.trim() === '') {
            alert('가격을 입력하세요');
            return;
        }

        if (actionStatus === MODIFICAION_TYPE) {
            // const isAlter = itemController.alter(itemCode.value, itemName.value)

            // if (!isAlter) {
            //     console.log('품목 코드가 올바르지 않습니다');
            //     return;
            // }
        } else {

            if (keywordTextBox.value.includes('<') && keywordTextBox.value.includes('>')) {
                parseItemList(
                    date,
                    quantityTextBox.value,
                    priceTextBox.value,
                    briefsTextBox.value
                )
            } else {
                alert("검색을 통해 아이템을 선택하세요")
                return
            }
            
        }

        excuteRefreshClose()
    })



    const rewriteButton = document.querySelector('#rewrite');
    rewriteButton.addEventListener('click', () => {
        const keywordTextBox = document.querySelector('#keyword');
        const quantityTextBox = document.querySelector('#quantity');
        const priceTextBox = document.querySelector('#price');
        const briefsTextBox = document.querySelector('#briefs');

        keywordTextBox.value = '';
        quantityTextBox.value = '';
        priceTextBox.value = '';
        briefsTextBox.value = '';
    })

    const closeButton = document.querySelector('#close');
    closeButton.addEventListener('click', () => window.close())
    
}

const parseItemList = (date, quantity, price, briefs) => {
  
    searchedItemList.forEach((item) => {
        specificationController.push(
            date,
            item.itemCode,
            item.itemName,
            quantity,
            price,
            briefs
        )
    })
};

function openPopup(url, x, y) {
    window.open(url, '_blank', `width=${x},height=${y}`); // 팝업 창 열기
}

function excuteRefreshClose() {

    const url = new URL(window.location.href);
    const page = url.searchParams.get('page');
    
    const message = {
        page: page
    }

    console.log(page)
    window.opener.postMessage(message, '*');
    window.close()
}