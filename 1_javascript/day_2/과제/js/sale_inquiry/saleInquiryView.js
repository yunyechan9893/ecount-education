import { SpecificationController } from "../common/controllers.js";
import { DateConponent } from "../common/component.js";
import { Page, ItemList, CheckBoxList, SearchedItems } from "./saleInquiryControllers.js";
import { messageTag } from "../common/enum.js"

const specificationController = new SpecificationController();

document.addEventListener('DOMContentLoaded', () => {
    init()
    eventListener()
})

function init() {
    initDate();
    ItemList.set(specificationController.getAll());
    printTableItem();

    // 팝업 창에서 넘겨받는 값
    window.addEventListener('message', function(event) {
        const page = event.data.page;
        if (page != null) {
            Page.setPage(page);
        }

        if (event.data.type === messageTag.ITEM_INQUIRY) {
            event.data.search.forEach(data => {
                createKeywordTag(data.itemCode, data.itemName);
                SearchedItems.push(data.itemCode, data.itemName);
            });
    
            printTableItem();
            return;
        }

        
        ItemList.set(specificationController.getAll());
        printTableItem();
    });
}

function eventListener() {

    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', () => {
        const keywordTextBox = document.getElementById('keyword');
        let keyword = keywordTextBox.value.length > 0 ? `&keyword=${keywordTextBox.value}` : '';
        openPopup(`/item/inquiry?page=10${keyword}`, 1000, 600)
    })

    const search2Button = document.querySelector('#search2');
    search2Button.addEventListener('click', () => {
        const searchInit = document.getElementById('clear-search-item');
        searchInit.style.backgroundColor = 'orange' 

        searchData();
        printTableItem();
        CheckBoxList.init()
    })

    const newButton = document.querySelector('#new');
    newButton.addEventListener('click', () => {
        openPopup(`/sales/registraion?page=${Page.getCurrentPage()}`, 1000, 300)
    })

    const nextButton = document.querySelector('#next');
    nextButton.addEventListener('click', () => {
        const itemSize = ItemList.size()

        Page.setNextPage(itemSize);
        printTableItem();
        checkParentCheckBox(false)
    })

    const prevButton = document.querySelector('#prev');
    prevButton.addEventListener('click', () => {

        Page.setPrevPage()
        printTableItem();
        checkParentCheckBox(false)
    })

    const selectedDeletionButton = document.querySelector('#selected-deletion');
    selectedDeletionButton.addEventListener('click', () => {
        CheckBoxList.get().forEach(checkbox => {
            const date = checkbox.getAttribute('data-date')
            const number = checkbox.getAttribute('data-number')
            specificationController.delete(date, number)
        
            ItemList.delete(date, number);
        });

        if (!Page.checkValidPageNumber(ItemList.size())) {
            Page.setPrevPage()
        }

        printTableItem();
        checkParentCheckBox(false);
    })

    const clearButton = document.querySelector('#clear-search-item');
    clearButton.addEventListener('click', () => {
        const searchInit = document.getElementById('clear-search-item');
        searchInit.style.backgroundColor = '';

        const keywordTextBox = document.querySelector('#keyword');
        const briefsTextBox = document.querySelector('#briefs')
        ItemList.set(specificationController.getAll());
        CheckBoxList.init();
        SearchedItems.init();
        keywordTextBox.value = '';
        briefsTextBox.value = '';
        printTableItem();
    })

    const selectorParent = document.querySelector('#selector-parent');

    selectorParent.onclick = () => {
        const selectors = document.getElementsByClassName('selector');
   
        Array.from(selectors).forEach(selector => {
            selector.checked = selectorParent.checked;
            CheckBoxList.push(selector);
        });
    }
}

function initDate() {
    const startYearSelector = document.getElementById('start-year');
    const startMonthSelector = document.getElementById('start-month');
    const startDaySelector = document.getElementById('start-day');

    const endYearSelector = document.getElementById('end-year');
    const endMonthSelector = document.getElementById('end-month');
    const endDaySelector = document.getElementById('end-day');

    // Initialize the selectors
    function initializeSelectors(yearSelector, monthSelector, daySelector) {
        DateConponent.populateYears(yearSelector);
        // Populate days based on the default values
        DateConponent.populateDays(
            parseInt(yearSelector.value, 10), 
            parseInt(monthSelector.value, 10), 
            daySelector
        );
    }

    initializeSelectors(startYearSelector, startMonthSelector, startDaySelector);
    initializeSelectors(endYearSelector, endMonthSelector, endDaySelector);

    // Update days when year or month changes
    function handleDateChange(yearSelector, monthSelector, daySelector) {
        const year = parseInt(yearSelector.value, 10);
        const month = parseInt(monthSelector.value, 10);
        DateConponent.populateDays(year, month, daySelector);
    }

    // Add event listeners for both start and end date selectors
    startYearSelector.addEventListener('change', () => handleDateChange(startYearSelector, startMonthSelector, startDaySelector));
    startMonthSelector.addEventListener('change', () => handleDateChange(startYearSelector, startMonthSelector, startDaySelector));

    endYearSelector.addEventListener('change', () => handleDateChange(endYearSelector, endMonthSelector, endDaySelector));
    endMonthSelector.addEventListener('change', () => handleDateChange(endYearSelector, endMonthSelector, endDaySelector));

}

function checkParentCheckBox(isTurnOn) {
    const selectorParent = document.querySelector('#selector-parent');
    selectorParent.checked = isTurnOn;
}

function searchData() {
    const startYearSelector = document.querySelector('#start-year');
    const startMonthSelector = document.querySelector('#start-month');
    const startDaySelector = document.querySelector('#start-day');
    const endYearSelector = document.querySelector('#end-year');
    const endMonthSelector = document.querySelector('#end-month');
    const endDaySelector = document.querySelector('#end-day');

    const selectedStartYearOption = startYearSelector.options[startYearSelector.selectedIndex].value;
    const selectedStartMonthOption = startMonthSelector.options[startMonthSelector.selectedIndex].value;
    const selectedStartDayOption = startDaySelector.options[startDaySelector.selectedIndex].value;
    const selectedEndYearOption = endYearSelector.options[endYearSelector.selectedIndex].value;
    const selectedEndMonthOption = endMonthSelector.options[endMonthSelector.selectedIndex].value;
    const selectedEndDayOption = endDaySelector.options[endDaySelector.selectedIndex].value;
    
    const startDate = selectedStartYearOption + "-" + selectedStartMonthOption + "-" + selectedStartDayOption;
    const endDate = selectedEndYearOption + "-" + selectedEndMonthOption + "-" + selectedEndDayOption;

    const briefs = document.querySelector('#briefs').value;

    ItemList.init();
    Page.init();
    
    const specification = specificationController.search(startDate, endDate, SearchedItems.get(), briefs)
    
    ItemList.set(specification);
}

const tableClear = () => {
    const tbody = document.getElementById('table-body');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

const addRow = (date, number, code, name, quantity, price, briefs) => {
    // 테이블의 <tbody> 요소를 가져옵니다.
    const tableBody = document.getElementById('table-body');
    
    // 새로운 <tr> 요소를 생성합니다.
    const row = document.createElement('tr');
    row.classList.add('row');
    
    const checkboxCell = document.createElement('th');
    const checkbox = document.createElement('input');
    checkbox.className = 'selector';
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-date', date);
    checkbox.setAttribute('data-number', number);
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    if (CheckBoxList.get().some(item => 
        item.getAttribute('data-date') === date &&
        item.getAttribute('data-number') === String(number)
    )) {
        checkbox.checked = true;
    }

    checkbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            CheckBoxList.push(checkbox)
        } else {
            CheckBoxList.delete(
                checkbox.getAttribute('data-date'),
                checkbox.getAttribute('data-number'))
        }
    });
    
    // 나머지 데이터 셀 생성
    const specificationDate = date + "-" + number;
    const cells = [specificationDate, code, name, quantity, price, briefs];

    cells.forEach((cellData, index) => {
        const cell = document.createElement('th');
        cell.textContent = cellData;

        if (cellData == specificationDate) {
            cell.classList.add('color-blue', 'modification');
            cell.onclick = () => {

                const queryParams = new URLSearchParams({
                    page: Page.getCurrentPage(),
                    date: date,
                    number: number,
                    code: code,
                    name: name,
                    quantity: quantity,
                    price: price,
                    briefs: briefs
                }).toString();

                const url = `/sales/modification?${queryParams}`;
        
                openPopup(url, 1000, 300);
            }
        }
        
        // 수량과 단가는 오른쪽 정렬
        if (index === 3 || index === 4) { // 3: 수량, 4: 단가
            cell.style.textAlign = 'end';
        }
        
        row.appendChild(cell);
    });
    
    // <tbody>에 새 행을 추가합니다.
    tableBody.appendChild(row);
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

    button.addEventListener('click', () => {
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

function printTableItem() {
    tableClear();
    checkPage();
    ItemList.get().slice(Page.getPrevPage(), Page.getCurrentPage()).forEach((specification) => {
        addRow(
            specification.date,
            specification.number,
            specification.code,
            specification.name,
            specification.quantity,
            specification.price,
            specification.briefs
        )
    });
}

function checkPage() {
    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    prevButton.disabled = !Page.existPrevPage();
    nextButton.disabled = !Page.existNextPage(ItemList.size());
}

function openPopup(url, x, y) {
    window.open(url, '_blank', `width=${x},height=${y}`); // 팝업 창 열기
}