import { Data } from "./itemInquiryModels.js";

const PAGE_LIMIT = 10;

export const Page = {
    init() {
        Data.page = PAGE_LIMIT;
    }
    ,
    getNextPage() {
        return Data.page + PAGE_LIMIT;
    },

    getPrevPage() {
        return Data.page - PAGE_LIMIT;
    },

    getCurrentPage() {
        return Data.page
    },

    setPage(page) {
        if (page == null) {
            return false;
        }

        Data.page = parseInt(page)
        return true; 
    },

    setNextPage(limit) {
        if (Data.page >= limit) {
            return false
        }

        Data.page += PAGE_LIMIT;
        return true;
    },

    setPrevPage() {
        if (Data.page <= PAGE_LIMIT) {
            return false // '마지막 페이지에 도달했습니다.'
        }
        Data.page -= PAGE_LIMIT;
        return true
    },
    existPrevPage() {
        if (Data.page <= PAGE_LIMIT) {
            return false
        }

        return true;
    },
    existNextPage(limit) {
        if (Data.page >= limit) {
            return false
        }

        return true;
    }
}

export const ItemList = {
    init() {
        Data.itemList = [];
    },
    get() {
        return Data.itemList;
    },
    set(items) {
        Data.itemList = items;
    },
    size() {
        return Data.itemList.length;
    },
    delete(code) {
        Data.itemList = Data.itemList.filter(item => item.code !== code);
    }
}

export const CheckBoxList = {
    init() {

    },
    get() {
        return Data.checkBoxList;
    },
    push(item) {
        Data.checkBoxList.push(item)
    },
    set(items) {
        Data.checkBoxList = items;
    },
    select(code) {
        let index = -1;

        Data.checkBoxList.forEach(item => {
            if (item.getAttribute('data-item-code') == code) {
                index = Data.checkBoxList.indexOf(item);
            }
        });

        return index;
    },
    delete(code) {
        const index = this.select(code);

        Data.checkBoxList.splice(index, 1);
    }
}

export const SelectLimit = {
    get() {
        return Data.checkedCheckboxLimit;
    },

    set(limit) {
        Data.checkedCheckboxLimit = limit;
    }
}

export const Status = {
    searchMode: {
        get() {
            return Data.isSearched;
        },
        setTrue() {
            Data.isSearched = true;
        },
        setFalse() {
            Data.isSearched = false;
        }
    }
}