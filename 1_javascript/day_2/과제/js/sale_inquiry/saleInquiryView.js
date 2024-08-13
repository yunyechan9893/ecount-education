import { SpecificationController } from "../common/controllers.js";
import { DateConponent } from "../common/component.js";
import { messageTag, EventType } from "../common/enum.js"
import { Page, ItemList, CheckBoxList, SearchedItems } from "./saleInquiryControllers.js";
import { ViewFinder } from "./saleInquiryMapping.js";

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
    window.addEventListener(EventType.message, function(event) {
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

    ViewFinder.button.search.addEventListener(EventType.click, () => {
        const keywordTextBox = ViewFinder.textbox.keyword;
        let keyword = keywordTextBox.value.length > 0 ? `&keyword=${keywordTextBox.value}` : '';
        let url = `/item/inquiry?page=10${keyword}`;
        openPopup(url, 1000, 600)
    })

    ViewFinder.button.searchMove.addEventListener(EventType.click, () => {
        const searchInitButton = ViewFinder.button.searchInit;
        searchInitButton.style.backgroundColor = 'orange'

        searchData();
        printTableItem();
        CheckBoxList.init()
    })

    ViewFinder.button.new.addEventListener(EventType.click, () => {
        let url = `/sales/registraion?page=${Page.getCurrentPage()}`;
        openPopup(url, 1000, 300);
    })

    ViewFinder.button.nextPage.addEventListener(EventType.click, () => {
        const itemSize = ItemList.size()

        Page.setNextPage(itemSize);
        printTableItem();
        checkParentCheckBox(false)
    })

    ViewFinder.button.prevPage.addEventListener(EventType.click, () => {

        Page.setPrevPage()
        printTableItem();
        checkParentCheckBox(false)
    })

    ViewFinder.button.specificationDelete.addEventListener(EventType.click, () => {
        CheckBoxList.get().forEach(checkbox => {
            const date = checkbox.dataset.date
            const number = checkbox.dataset.number
            specificationController.delete(date, number)
        
            ItemList.delete(date, number);
        });

        if (!Page.checkValidPageNumber(ItemList.size())) {
            Page.setPrevPage()
        }

        printTableItem();
        checkParentCheckBox(false);
    })

    ViewFinder.button.searchedItemClean.addEventListener(EventType.click, () => {
        const searchInit = ViewFinder.button.searchInit;
        searchInit.style.backgroundColor = '';

        const keywordTextBox = ViewFinder.textbox.keyword;
        const briefsTextBox = ViewFinder.textbox.briefs;
        ItemList.set(specificationController.getAll());
        CheckBoxList.init();
        SearchedItems.init();
        keywordTextBox.value = '';
        briefsTextBox.value = '';
        printTableItem();
    })


    ViewFinder.checkbox.selectorParent.onclick = () => {
        const selectors = ViewFinder.checkbox.selectorChild;
   
        Array.from(selectors).forEach(selector => {
            selector.checked = selectorParent.checked;
            CheckBoxList.push(selector);
        });
    }
}

function initDate() {
    const startYearSelector = ViewFinder.dropbox.startYear;
    const startMonthSelector = ViewFinder.dropbox.startMonth;
    const startDaySelector = ViewFinder.dropbox.startDay;

    const endYearSelector = ViewFinder.dropbox.endYear;
    const endMonthSelector = ViewFinder.dropbox.endMonth;
    const endDaySelector = ViewFinder.dropbox.endDay;

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
    startYearSelector.addEventListener(EventType.change, () => handleDateChange(startYearSelector, startMonthSelector, startDaySelector));
    startMonthSelector.addEventListener(EventType.change, () => handleDateChange(startYearSelector, startMonthSelector, startDaySelector));

    endYearSelector.addEventListener(EventType.change, () => handleDateChange(endYearSelector, endMonthSelector, endDaySelector));
    endMonthSelector.addEventListener(EventType.change, () => handleDateChange(endYearSelector, endMonthSelector, endDaySelector));

}

function checkParentCheckBox(isTurnOn) {
    const selectorParent = ViewFinder.checkbox.selectorParent;
    selectorParent.checked = isTurnOn;
}

function searchData() {
    const startYearSelector = ViewFinder.dropbox.startYear;
    const startMonthSelector = ViewFinder.dropbox.startMonth;
    const startDaySelector = ViewFinder.dropbox.startDay;
    const endYearSelector = ViewFinder.dropbox.endYear;
    const endMonthSelector = ViewFinder.dropbox.endMonth;
    const endDaySelector = ViewFinder.dropbox.endDay;

    const selectedStartYearOption = startYearSelector.options[startYearSelector.selectedIndex].value;
    const selectedStartMonthOption = startMonthSelector.options[startMonthSelector.selectedIndex].value;
    const selectedStartDayOption = startDaySelector.options[startDaySelector.selectedIndex].value;
    const selectedEndYearOption = endYearSelector.options[endYearSelector.selectedIndex].value;
    const selectedEndMonthOption = endMonthSelector.options[endMonthSelector.selectedIndex].value;
    const selectedEndDayOption = endDaySelector.options[endDaySelector.selectedIndex].value;
    
    const startDate = selectedStartYearOption + "-" + selectedStartMonthOption + "-" + selectedStartDayOption;
    const endDate = selectedEndYearOption + "-" + selectedEndMonthOption + "-" + selectedEndDayOption;

    const briefs = ViewFinder.textbox.briefs.value;

    ItemList.init();
    Page.init();
    
    const specification = specificationController.search(startDate, endDate, SearchedItems.get(), briefs)
    
    ItemList.set(specification);
}

const tableClear = () => {
    const tbody = ViewFinder.table.body;

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

const addRow = (date, number, code, name, quantity, price, briefs) => {
    // 테이블의 <tbody> 요소를 가져옵니다.
    const tableBody = ViewFinder.table.body;
    
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
        item.dataset.date === date &&
        item.dataset.number === String(number)
    )) {
        checkbox.checked = true;
    }

    checkbox.addEventListener(EventType.change, function(event) {
        if (event.target.checked) {
            CheckBoxList.push(checkbox)
        } else {
            CheckBoxList.delete(checkbox.dataset.date, checkbox.dataset.number)
        }
    });
    
    // 나머지 데이터 셀 생성
    const totalPrice = quantity * price
    const specificationDate = date + "-" + number;
    const cells = [specificationDate, code, name, quantity, price, totalPrice, briefs];

    cells.forEach((cellData, index) => {
        const cell = document.createElement('th');

        if (typeof cellData == 'number' || !isNaN(cellData)) {
            cellData = String(cellData).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

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
        if (index === 3 || index === 4 || index === 5) { // 3: 수량, 4: 단가
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

function printTableItem() {
    tableClear();
    checkPage();

    let totalQuantity = 0;
    let totalPrice = 0;
    let totalSalePrice = 0;
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

        totalQuantity += Number(specification.quantity);
        totalPrice += Number(specification.price);
        totalSalePrice +=  Number(specification.quantity * specification.price);
    });

    // addRow(
    //     '',
    //     '-',
    //     '-',
    //     totalQuantity,
    //     totalPrice,
    //     totalSalePrice,
    //     '-',
    // )
}

function checkPage() {
    const prevButton = ViewFinder.button.prevPage;
    const nextButton = ViewFinder.button.nextPage;

    prevButton.disabled = !Page.existPrevPage();
    nextButton.disabled = !Page.existNextPage(ItemList.size());
}

function openPopup(url, x, y) {
    window.open(url, '_blank', `width=${x},height=${y}`); // 팝업 창 열기
}