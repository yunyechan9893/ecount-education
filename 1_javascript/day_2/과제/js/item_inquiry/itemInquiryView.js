import { ItemController } from "../common/controllers.js";
import { messageTag, EventType } from "../common/enum.js"
import { Page, ItemList, CheckBoxList, SelectLimit } from "./itemInquiryControllers.js";
import { ViewFinder } from "./itemInquiryMapping.js";


const ITEM_INQUIRY_API = '/item/inquiry'

const itemController = new ItemController();

document.addEventListener(EventType.DOMContentLoaded, () => {
    init()
    eventListener();
})

function init() {
    const queryParams = new URLSearchParams(window.location.search);
    const page = queryParams.get('page');
    const choiceLimit = queryParams.get('limit');
    const keyword = queryParams.get('keyword');

    Page.setPage(page);

    if (choiceLimit) {
        SelectLimit.set(choiceLimit);
    }

    if (keyword) {
        ViewFinder.textbox.dataName.value = keyword;
        handleSearchButtonClick();
    } else {
        initializeTableItem();
    }
    
    window.addEventListener(EventType.message, function(event) {
        if (event.data.type === messageTag.ITEM_INQUIRY) {
            const queryParams = new URLSearchParams(window.location.search);
            const page = queryParams.get('page');
            
            if (page != null) {
                Page.setPage(page)
            }
         
            // 페이지 새로 고침
            initializeTableItem()
        }
    });
}

function eventListener() {

    ViewFinder.button.new.addEventListener(EventType.click, ()=> {
        const queryParams = new URLSearchParams({
            page: Page.getCurrentPage()
        }).toString();
        
        // 팝업을 여는 URL을 생성합니다.
        const url = `/item/registration?${queryParams}`;
        
        openPopup(url);
    })

    ViewFinder.button.nextPage.addEventListener(EventType.click, () => {
        const itemSize = ItemList.size();
 
        Page.setNextPage(itemSize);
        printTableItem();
        checkParentCheckBox(false);
    })

    ViewFinder.button.prevPage.addEventListener(EventType.click, () => {
        Page.setPrevPage();
        printTableItem();
        checkParentCheckBox(false);
    })

    ViewFinder.button.search.addEventListener(EventType.click, () => handleSearchButtonClick())

    ViewFinder.button.searchedItemClean.addEventListener(EventType.click, () => {
        ViewFinder.button.searchedItemClean.style.backgroundColor = '' 
        initializeTableItem()})

    ViewFinder.button.apply.addEventListener(EventType.click, () => {
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

    ViewFinder.button.close.addEventListener(EventType.click, () => window.close())

    ViewFinder.checkbox.parent.onclick = () => {
        const selectors = document.getElementsByClassName('selector');
   
        Array.from(selectors).forEach(selector => {
            selector.checked = ViewFinder.checkbox.parent.checked;
        });
    }

    ViewFinder.button.delete.addEventListener(EventType.click, () => {
        CheckBoxList.get().forEach((item) => {
            const code = item.dataset.itemCode;

            itemController.delete(code);
            ItemList.delete(code)
            
        });

        Page.init();
        printTableItem();
        checkParentCheckBox(false);
    })
}

function checkParentCheckBox(isTurnOn) {;
    ViewFinder.checkbox.parent.checked = isTurnOn;
}

function openPopup(url) {
    window.open(url, '_blank', 'width=600,height=400'); // 팝업 창 열기
}

const tableClear = () => {
    const tbody = ViewFinder.table.body;

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

const addRow = (code, name) => {
    // 테이블의 tbody를 찾습니다.
    const tbody = ViewFinder.table.body;
    
    // 새로운 tr 요소를 생성합니다.
    const tr = document.createElement('tr');
    tr.classList.add('row');
    
    // 새로운 th 요소를 생성하고 내용 추가
    const checkboxTh = document.createElement('th');
    const checkbox = document.createElement('input');
    checkbox.className = 'selector';
    checkbox.type = 'checkbox';
    checkbox.dataset.itemCode = code;
    checkboxTh.appendChild(checkbox);

    if (CheckBoxList.get().some(item => item.dataset.itemCode === code)) {
        checkbox.checked = true;
    }

    checkbox.addEventListener(EventType.change, function(event) {
        if (event.target.checked) {
            CheckBoxList.push(checkbox);
        } else {
            const code = checkbox.dataset.itemCode;
            CheckBoxList.delete(code);
        }
    });
    
    const codeTh = document.createElement('th');
    codeTh.classList.add('color-blue');
    codeTh.dataset.code = code;
    codeTh.textContent = code;
    
    const nameTh = document.createElement('th');
    nameTh.dataset.name = name;
    nameTh.textContent = name;
    
    const modificationTh = document.createElement('th');
    modificationTh.classList.add('color-blue', 'modification');
    modificationTh.style.textAlign = 'center';
    modificationTh.textContent = '수정';
    
    // 클릭 이벤트를 추가합니다.
    modificationTh.addEventListener(EventType.click, () => {
        // 버튼이 포함된 행(row)을 찾습니다.
        const row = modificationTh.closest('.row');
        
        // 해당 행에서 품목 코드와 품목명을 가져옵니다.
        const itemCode = row.querySelector('th.color-blue').dataset.code;
        const itemName = row.querySelector('th[data-name]').dataset.name;
        
        // 쿼리 파라미터로 추가할 데이터
        const queryParams = new URLSearchParams({
            code: itemCode,
            name: itemName,
            page: Page.getCurrentPage()
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
    ItemList.set(itemController.getAll())

    printTableItem();
}

function printTableItem() {
    tableClear();
    checkPage();
    ItemList.get().slice(Page.getPrevPage(), Page.getCurrentPage()).forEach((item) => {
        addRow(item.code, item.name)
    });
}

function handleSearchButtonClick() {
    const itemCode = ViewFinder.textbox.dataCode;
    const itemName = ViewFinder.textbox.dataName;

    let itemCodeValue = itemCode.value == null ? '' : itemCode.value;
    let itemNameValue = itemName.value == null ? '' : itemName.value;

    if (itemCodeValue.length <= 0 && itemNameValue.length <= 0) {
        alert('품목코드 혹은 품목명을 입력해주세요')
        return
    }

    ViewFinder.button.searchedItemClean.style.backgroundColor = 'orange' 
    Page.init()
    performSearch(itemCodeValue, itemNameValue);
}

function performSearch(code, value) {
    const searchedList = itemController.searchItems(code, value);
    ItemList.set(searchedList);
    printTableItem();
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
    CheckBoxList.get().forEach((checkbox) => {
        if (checkbox.checked) {
            checkBoxList.push(checkbox)
        }
    });

    if (checkBoxList.length == 0) {
        alert('체크 박스를 선택해주세요.')
        return []
    }

    if (checkBoxList.length > SelectLimit.get()) {
        alert(`체크 박스는 ${SelectLimit.get()}개만 적용할 수 있습니다.`)
        return [];
    }

    return checkBoxList;
}

function checkPage() {
    ViewFinder.button.prevPage.disabled = !Page.existPrevPage();
    ViewFinder.button.nextPage.disabled = !Page.existNextPage(ItemList.size());
}