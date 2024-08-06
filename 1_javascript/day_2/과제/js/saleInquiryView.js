import { SpecificationController } from "./controllers.js";
import { messageTag } from "./enum.js"

const PAGE_LIMIT = 10;
const checkedCheckboxList = []
let pageStatus = PAGE_LIMIT;
let itemList;
const searchedItemList = [];

const specificationController = new SpecificationController();

document.addEventListener('DOMContentLoaded', () => {
    init()
    eventListener()
})

function init() {

    initTable();

    // 팝업 창에서 넘겨받는 값
    window.addEventListener('message', function(event) {
        console.log(event)
        if (event.data.type === messageTag.ITEM_INQUIRY) {

            event.data.search.forEach(data => {
                searchedItemList.push({ itemCode: data.itemCode, itemName: data.itemName });
            });
    
            getSearchData();
            return;
        }

        pageStatus = event.data.page;
        initTable();
    });
}

function eventListener() {

    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', () => {
        openPopup(`/item/inquiry`, 1000, 600)
    })

    const search2Button = document.querySelector('#search2');
    search2Button.addEventListener('click', () => {
        getSearchData();
    })

    const newButton = document.querySelector('#new');
    newButton.addEventListener('click', () => {
        openPopup(`/sales/registraion?page=${pageStatus}`, 1000, 300)
    })

    const nextButton = document.querySelector('#next');
    nextButton.addEventListener('click', () => {
        const specificationSize = specificationController.getAll().length;

        if (specificationSize < pageStatus) {
            return;
        }

        pageStatus = pageStatus + PAGE_LIMIT;
        initializeTableItem();
    })

    const prevButton = document.querySelector('#prev');
    prevButton.addEventListener('click', () => {

        if (0 >= pageStatus - PAGE_LIMIT) {
            return;
        }

        pageStatus = pageStatus - PAGE_LIMIT;
        initializeTableItem();
    })

    const selectedDeletionButton = document.querySelector('#selectedDeletion');
    selectedDeletionButton.addEventListener('click', () => {
        checkedCheckboxList.forEach(checkbox => {
            const date = checkbox.getAttribute('data-date')
            const number = checkbox.getAttribute('data-number')
            specificationController.delete(date, number)
            
            
            getSearchData();
        });
    })

    const clearButton = document.querySelector('#clear-search-item');
    clearButton.addEventListener('click', () => {
        clearSearchedItemTextBox();
    })
    
}

function initTable() {
    const specifications = specificationController.getAll();
    tableClear();
    specifications.slice(pageStatus - PAGE_LIMIT, pageStatus).forEach((specification) => {
        addRow(
            specification.date,
            specification.number,
            specification.code,
            specification.name,
            specification.quantity,
            specification.price,
            specification.briefs
        )
    })
}

function clearSearchedItemTextBox() {
    const keywordTextBox = document.querySelector('#keyword');
    initTable()
    keywordTextBox.value = '';
}

function getSearchData() {
    let itemLabel = ''
    searchedItemList.forEach(item => {
        itemLabel += `<${item.itemCode}(${item.itemName})>`
    });

    const keywordTextBox = document.querySelector('#keyword');
    keywordTextBox.value = itemLabel;
    
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

    const searchedItemList2 = []
    searchedItemList.forEach((item) => {
        const itemCode = item.itemCode
        const itemName = item.itemName
        Array.prototype.push.apply(searchedItemList2, specificationController.search(startDate, endDate, itemCode, itemName, briefs));
    })

    tableClear();
    searchedItemList2.slice(pageStatus - PAGE_LIMIT, pageStatus).forEach((specification) => {
        addRow(
            specification.date,
            specification.number,
            specification.code,
            specification.name,
            specification.quantity,
            specification.price,
            specification.briefs
        )
    })
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
    
    // 체크박스 셀 생성
    

    // 체크박스 생성
    const checkboxCell = document.createElement('th');
    const checkbox = document.createElement('input');
    checkbox.className = 'selector';
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-date', date);
    checkbox.setAttribute('data-number', number);
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    if (checkedCheckboxList.some(item => 
        item.getAttribute('data-date') === date &&
        item.getAttribute('data-number') === number
    )) {
        checkbox.checked = true;
    }

    checkbox.addEventListener('change', function(event) {
        if (event.target.checked) {
            checkedCheckboxList.push(checkbox)
        } else {
            const index = checkedCheckboxList.indexOf(checkbox);
            if (index !== -1) {
                checkedCheckboxList.splice(index, 1);
            }
        }
    });
    
    // 나머지 데이터 셀 생성
    const specificationDate = date + "-" + number;
    const cells = [specificationDate, code, name, quantity, price, briefs];
    cells.forEach((cellData, index) => {
        const cell = document.createElement('th');
        cell.textContent = cellData;
        
        // 수량과 단가는 오른쪽 정렬
        if (index === 3 || index === 4) { // 3: 수량, 4: 단가
            cell.style.textAlign = 'end';
        }
        
        row.appendChild(cell);
    });
    
    // <tbody>에 새 행을 추가합니다.
    tableBody.appendChild(row);
}

function initializeTableItem() {
    const specificationList = specificationController.getAll();

    printTableItem(specificationList);
}

function printTableItem(specificationList) {
    tableClear();
    specificationList.slice(pageStatus - PAGE_LIMIT, pageStatus).forEach((specification) => {
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

function openPopup(url, x, y) {
    window.open(url, '_blank', `width=${x},height=${y}`); // 팝업 창 열기
}