import { SpecificationController } from "../common/controllers.js";
import { DateConponent } from "../common/component.js";
import { messageTag, EventType } from "../common/enum.js"
import { PageStatus, SearchedItems, Specification } from "./saleInputControllers.js";
import { ViewFinder } from "./saleInputMapping.js";


const MODIFICAION_PATH = '/sales/modification'
const specificationController = new SpecificationController();

document.addEventListener('DOMContentLoaded', () => {
    initDate();

    const path = window.location.pathname;
    const titleText = ViewFinder.textbox.title;
    if (path === MODIFICAION_PATH) {

        const queryParams = new URLSearchParams(window.location.search);
        
        
        const code = queryParams.get('code');
        const name = queryParams.get('name');
        const quantity = queryParams.get('quantity');
        const price = queryParams.get('price');
        const briefs = queryParams.get('briefs');

        Specification.date.set(queryParams.get('date'));
        Specification.number.set(queryParams.get('number'));
        Specification.code.set(queryParams.get('code'));
        Specification.name.set(queryParams.get('name'));
        Specification.quantity.set(queryParams.get('quantity'));
        Specification.price.set(queryParams.get('price'));
        Specification.briefs.set(queryParams.get('briefs'));

        SearchedItems.push(code, name);

        // date 값을 '-'로 분리하여 [year, month, day]로 나눕니다.
        const [selectedYear, selectedMonth, selectedDay] = Specification.date.get().split('-');

        // 각 드롭다운 요소를 가져옵니다.
        const yearDropBox = ViewFinder.dropbox.year;
        const monthDropBox = ViewFinder.dropbox.month;
        const dayDropBox = ViewFinder.dropbox.day;

        // 드롭다운에서 옵션을 선택하는 함수
        function selectOption(dropBox, value) {
            const option = Array.from(dropBox.options).find(option => option.value === value);
            if (option) {
                option.selected = true;
            }
        }

        // 각 드롭다운에 대해 선택 옵션을 설정합니다.
        selectOption(yearDropBox, selectedYear);
        selectOption(monthDropBox, selectedMonth);
        selectOption(dayDropBox, selectedDay);

        yearDropBox.disabled = true
        monthDropBox.disabled = true
        dayDropBox.disabled = true

        const numberSaction = document.getElementById('number-saction');
        const numberTextBox = ViewFinder.textbox.number;
        const deleteButton = ViewFinder.button.delete;
        const priceTextBox = ViewFinder.textbox.price;
        const quantityTextBox = ViewFinder.textbox.quantity;
        const briefsTextBox = ViewFinder.textbox.briefs;
    
        createKeywordTag(Specification.code.get(), Specification.name.get());
        quantityTextBox.value = quantity;
        priceTextBox.value = price;
        briefsTextBox.value = briefs;
        numberTextBox.value = Specification.number.get();

        titleText.innerText = "■ 판매 수정"
        numberSaction.style.display = 'inline';
        deleteButton.hidden = false;
        PageStatus.setModification();
    }
    
    titleText.innerText = "■ 판매 입력"
    eventListener()

    // 화면 리로드 이벤트
    window.addEventListener(EventType.message, function(event) {
        
        clearTagBox();
        if (event.data.type === messageTag.SALE_INPUT) {
            event.data.search.forEach(data => {
                
                createKeywordTag(data.itemCode, data.itemName);

                if (PageStatus.checkModificationStatus()) {
                    SearchedItems.init();
                    SearchedItems.push(data.itemCode, data.itemName);
                    return;
                }
                
                SearchedItems.push(data.itemCode, data.itemName);
            });
        }
    });

    
})

function eventListener() {
    const searchButton = ViewFinder.button.search;
    searchButton.addEventListener(EventType.click, () => {
        let limit = PageStatus.checkModificationStatus() ? `&limit=${1}` : `&limit=${3}`;
        const keywordTextBox = document.getElementById('keyword');
        let keyword = keywordTextBox.value.length > 0 ? `&keyword=${keywordTextBox.value}` : '';
        let url = `/sales/search?page=10${limit}${keyword}`;
        openPopup(url, 1000, 600)
    })

    ViewFinder.button.save.addEventListener(EventType.click, () => {
        const yearSelector = ViewFinder.dropbox.year;
        const monthSelector = ViewFinder.dropbox.month;
        const daySelector = ViewFinder.dropbox.day;

        const selectedYearOption = yearSelector.options[yearSelector.selectedIndex].value;
        const selectedMonthOption = monthSelector.options[monthSelector.selectedIndex].value;
        const selectedDayOption = daySelector.options[daySelector.selectedIndex].value;

        const date = selectedYearOption + "-" + selectedMonthOption + "-" + selectedDayOption;

        const quantityTextBox = ViewFinder.textbox.quantity;
        const priceTextBox = ViewFinder.textbox.price;
        const briefsTextBox = ViewFinder.textbox.briefs;

        if (selectedYearOption == null && selectedYearOption == '') {
            alert('연도를 입력하세요')
            return
        } else if (selectedMonthOption == null && selectedMonthOption == '' ) {
            alert('월을 입력하세요') 
            return
        } else if (selectedDayOption == null && selectedDayOption == '' ) {
            alert('일을 입력하세요') 
            return
        } if (SearchedItems.size()<1) {
            alert('품목을 입력하세요');
            return;
        } else if (quantityTextBox.value.trim() === '') {
            alert('수량을 입력하세요');
            return;
        } else if (priceTextBox.value.trim() === '') {
            alert('가격을 입력하세요');
            return;
        }

        if (PageStatus.checkModificationStatus()) {
            specificationController.alter(
                Specification.date.get(), 
                Specification.number.get(), 
                SearchedItems.findFirst().itemCode,
                SearchedItems.findFirst().itemName, 
                quantityTextBox.value,
                priceTextBox.value, 
                briefsTextBox.value)
        } else {
            SearchedItems.get().forEach((item) => {
                specificationController.push(
                    date,
                    item.itemCode,
                    item.itemName, 
                    quantityTextBox.value,
                    priceTextBox.value, 
                    briefsTextBox.value
                )
            })
          }

        excuteRefreshClose()
    })

    const rewriteButton = ViewFinder.button.rewrite;
    rewriteButton.addEventListener(EventType.click, () => {
        const numberTextBox = ViewFinder.textbox.number;
        const quantityTextBox = ViewFinder.table.quantity;
        const priceTextBox = ViewFinder.textbox.price;
        const briefsTextBox = ViewFinder.textbox.briefs;

        if (PageStatus.checkModificationStatus()) {
            createKeywordTag(Specification.code.get(), Specification.name.get());
            quantityTextBox.value = Specification.quantity.get();
            priceTextBox.value = Specification.price.get();
            briefsTextBox.value = Specification.briefs.get();
            numberTextBox.value = Specification.number.get();

            SearchedItems.init();
            SearchedItems.push(Specification.code.get(), Specification.name.get())
            return;
        }

        // 미래의 날짜 추가

        keywordTextBox.value = '';
        quantityTextBox.value = '';
        priceTextBox.value = '';
        briefsTextBox.value = '';
        return;
    })

    const deleteButton = ViewFinder.button.delete;

    deleteButton.addEventListener(EventType.click, () => {
        specificationController.delete(
            Specification.date.get(),
            Specification.number.get()
        );
        
        excuteRefreshClose();
    })

    const closeButton = ViewFinder.button.close;
    closeButton.addEventListener(EventType.click, () => window.close())
    
}

function initDate() {
    const yearSelector = ViewFinder.dropbox.year;
    const monthSelector = ViewFinder.dropbox.month;
    const daySelector = ViewFinder.dropbox.day;

    function initializeSelectors(yearSelector, monthSelector, daySelector) {
        DateConponent.populateYears(yearSelector);
        DateConponent.populateDays(
            parseInt(yearSelector.value, 10), 
            parseInt(monthSelector.value, 10), 
            daySelector
        );
    }

    initializeSelectors(yearSelector, monthSelector, daySelector);

    function handleDateChange(yearSelector, monthSelector, daySelector) {
        const year = parseInt(yearSelector.value, 10);
        const month = parseInt(monthSelector.value, 10);
        DateConponent.populateDays(year, month, daySelector);
    }

    yearSelector.addEventListener(EventType.change, () => handleDateChange(yearSelector, monthSelector, daySelector));
    monthSelector.addEventListener(EventType.change, () => handleDateChange(yearSelector, monthSelector, daySelector));
}

function createKeywordTag(code, name) {
    // Create the div element for the keyword tag
    const keywordTag = document.createElement('div');
    keywordTag.id = code
    keywordTag.className = 'keyword-tag';
    keywordTag.style.marginLeft = `10px`;

    // Create the span element for the text
    const span = document.createElement('span');
    span.innerHTML =`&lt;${name}(${code})&gt;`;
    
    // Create the button element
    const button = document.createElement('button');
    button.className = 'tag-close'
    button.textContent = 'x';

    button.addEventListener(EventType.click, () => {
        keywordTag.remove(code)
        SearchedItems.delete(code);
    })
    
    // Append the span and button to the keyword tag
    keywordTag.appendChild(span);
    keywordTag.appendChild(button);
    
    // Append the keyword tag to the element-box
    const elementBox = document.getElementById('element-box');
    // elementBox.innerHTML = ''; // Clear previous content if needed
    elementBox.appendChild(keywordTag);
}

function clearTagBox() {
    const elementBox = document.getElementById('element-box');
    elementBox.innerHTML = ''; // Clear previous content
}

function openPopup(url, x, y) {
    window.open(url, '_blank', `width=${x},height=${y}`); // 팝업 창 열기
}

function excuteRefreshClose() {

    const url = new URL(window.location.href);
    const page = url.searchParams.get('page');
    
    const message = {
        page: page
    }

    window.opener.postMessage(message, '*');
    window.close()
}