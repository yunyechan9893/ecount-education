import { ItemController } from "./controllers.js";
import { messageTag } from "./enum.js"

const PAGE_LIMIT = 10;
const CHECKED_CHECKBOX_LIMIT = 3;
const ITEM_INQUIRY_API = '/item/inquiry'
const checkedCheckboxList = []
let pageStatus = PAGE_LIMIT;

const itemController = new ItemController();

document.addEventListener('DOMContentLoaded', () => {
    // 검색어, 페이지 초기화 이벤트
    // URL에서 쿼리 파라미터를 가져옵니다.
    const queryParams = new URLSearchParams(window.location.search);

    // 'code'와 'name' 쿼리 파라미터를 가져옵니다.
    const keyword = queryParams.get('keyword');
    const page = queryParams.get('page');
    // const keywordTextBox = document.querySelector('#item-name');

    pageStatus = page == null ? PAGE_LIMIT : parseInt(page);
    // keywordTextBox.value = keyword == null ? "w":keyword;

    if (keyword != null) {
        performSearch('', keyword)
        document.querySelector('#data-name').value = keyword
    } else {
        // 테이블 아이템 초기화 이벤트
        initializeTableItem()
    }
    // item-registration 팝업 띄움 이벤트
    const newButton = document.querySelector('#new')
    newButton.addEventListener('click', ()=> {
        const queryParams = new URLSearchParams({
            page: pageStatus
        }).toString();
        
        // 팝업을 여는 URL을 생성합니다.
        const url = `/item/registration?${queryParams}`;
        
        openPopup(url);
    })

    // 화면 리로드 이벤트
    window.addEventListener('message', function(event) {
        console.log(event)
        if (event.data.type === messageTag.ITEM_INQUIRY) {
            // 메인 화면 새로고침
            const url = new URL(window.location.href);
            url.searchParams.set('page', event.data.page);

            // 페이지 새로 고침
            window.location.href = url.toString();
        }
    });

    const nextButton = document.querySelector('#next');
    nextButton.addEventListener('click', () => {
        const itemSize = itemController.getAll().length;

        console.log(itemSize, pageStatus)
        if (itemSize < pageStatus) {
            return;
        }

        pageStatus = pageStatus + PAGE_LIMIT;
        initializeTableItem();
    })

    const prevButton = document.querySelector('#prev');
    prevButton.addEventListener('click', () => {
        const itemSize = itemController.getAll().length;

        console.log(itemSize, pageStatus)
        if (0 >= pageStatus - PAGE_LIMIT) {
            return;
        }

        pageStatus = pageStatus - PAGE_LIMIT;
        initializeTableItem();
    })

    const searchButton = document.querySelector('#search');
    searchButton.addEventListener('click', () => handleSearchButtonClick())

    const cancelSearchButton = document.querySelector('#cancel-search');
    cancelSearchButton.addEventListener('click', () => initializeTableItem())

    const applyButton = document.querySelector('#apply');
    applyButton.addEventListener('click', () => {
        const selectedCheckboxes = checkSelectedCheckboxToLimit();
        const rowData = [];

        if (selectedCheckboxes.length == 0) {
            return;
        }

        selectedCheckboxes.forEach((checkbox) => {
            // 체크박스의 부모 요소 <th>에서 <tr> 요소를 찾습니다.
            const row = checkbox.closest('tr');
            if (row) {
                // 각 셀에서 원하는 데이터를 추출합니다.
                const cells = row.getElementsByTagName('th');
                const itemCode = cells[1].textContent.trim(); // P100001
                const itemName = cells[2].textContent.trim(); // 진라면
                rowData.push({ itemCode, itemName });
            }
        });

        const path = window.location.pathname;
        if (path === ITEM_INQUIRY_API) { 
            excuteRefreshClose(rowData, messageTag.ITEM_INQUIRY)
            return
        } 

        excuteRefreshClose(rowData, messageTag.SALE_INPUT)
    })

    const closeButton = document.querySelector('#close');
    closeButton.addEventListener('click', () => window.close())
})

function openPopup(url) {
    window.open(url, '_blank', 'width=600,height=400'); // 팝업 창 열기
}

const tableClear = () => {
    const tbody = document.getElementById('tableBody');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

const addRow = (code, name) => {
    // 테이블의 tbody를 찾습니다.
    const tbody = document.getElementById('tableBody');
    
    // 새로운 tr 요소를 생성합니다.
    const tr = document.createElement('tr');
    tr.classList.add('row');
    
    // 새로운 th 요소를 생성하고 내용 추가
    const checkboxTh = document.createElement('th');
    const checkbox = document.createElement('input');
    checkbox.className = 'selector';
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-item-code', code);
    checkboxTh.appendChild(checkbox);

    if (checkedCheckboxList.some(item => item.getAttribute('data-item-code') === code)) {
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
    
    const codeTh = document.createElement('th');
    codeTh.classList.add('color-blue');
    codeTh.setAttribute('data-code', code);
    codeTh.textContent = code;
    
    const nameTh = document.createElement('th');
    nameTh.setAttribute('data-name', name);
    nameTh.textContent = name;
    
    const modificationTh = document.createElement('th');
    modificationTh.classList.add('color-blue', 'modification');
    modificationTh.style.textAlign = 'center';
    modificationTh.textContent = '수정';
    
    // 클릭 이벤트를 추가합니다.
    modificationTh.addEventListener('click', () => {
        // 버튼이 포함된 행(row)을 찾습니다.
        const row = modificationTh.closest('.row');
        
        // 해당 행에서 품목 코드와 품목명을 가져옵니다.
        const itemCode = row.querySelector('th.color-blue').getAttribute('data-code');
        const itemName = row.querySelector('th[data-name]').getAttribute('data-name');
        
        // 쿼리 파라미터로 추가할 데이터
        const queryParams = new URLSearchParams({
            code: itemCode,
            name: itemName,
            page: pageStatus
        }).toString();
        
        // 팝업을 여는 URL을 생성합니다.
        const url = `/item/modification?${queryParams}`;
        
        openPopup(url);
    });
    
    // tr 요소에 th 요소를 추가합니다.
    tr.appendChild(checkboxTh);
    tr.appendChild(codeTh);
    tr.appendChild(nameTh);
    tr.appendChild(modificationTh);
    
    // tbody에 tr을 추가합니다.
    tbody.appendChild(tr);
}

function initializeTableItem() {
    const itemList = itemController.getAll();

    printTableItem(itemList);
}

function printTableItem(itemList) {
    tableClear();
    itemList.slice(pageStatus - PAGE_LIMIT, pageStatus).forEach((item) => {
        addRow(item.code, item.name)
    });
}

function handleSearchButtonClick() {
    const itemCode = document.querySelector('#data-code')
    const itemName = document.querySelector('#data-name')

    let itemCodeValue = itemCode.value == null ? '' : itemCode.value;
    let itemNameValue = itemName.value == null ? '' : itemName.value;

    if (itemCodeValue.length <= 0 && itemNameValue.length <= 0) {
        console.log('품목코드 혹은 품목명을 입력해주세요')
        return
    }

    performSearch(itemCodeValue, itemNameValue);
}

function performSearch(code, value) {
    const searchedList = itemController.searchItems(code, value);
    printTableItem(searchedList);
}

function excuteRefreshClose(bundle, messageType) {
    const message = {
        type: messageType,
        search: bundle
    };

    window.opener.postMessage(message, '*');
    window.close()
}
// 여기
function checkSelectedCheckboxToLimit() {
    let checkBoxList = [];

    // HTMLCollection은 배열 메서드가 없으므로 forEach를 사용하려면 Array.from()을 사용해야 합니다.
    checkedCheckboxList.forEach((checkbox) => {
        if (checkbox.checked) {
            checkBoxList.push(checkbox)
        }
    });

    if (checkBoxList.length == 0) {
        alert('체크 박스를 선택해주세요.')
        return []
    }

    if (checkBoxList.length > CHECKED_CHECKBOX_LIMIT) {
        alert('체크 박스는 3개만 적용할 수 있습니다.')
        return [];
    }

    return checkBoxList;
}