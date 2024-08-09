import { Data } from "./saleInquiryModels.js";

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
            return false
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
    },
    checkValidPageNumber(currentItemSize) {
        if (Data.page - PAGE_LIMIT >= currentItemSize) {
            return false;
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
    push(item) {
        Data.itemList.push(item);
    },
    size() {
        return Data.itemList.length;
    },
    delete(date, number) {
        let deletedItemindex;
        Data.itemList.forEach((item) => {
            if (item.date == date && item.number == String(number)) {
                deletedItemindex = Data.itemList.indexOf(item);
                return;
            }
        })

        if (deletedItemindex == undefined) {
            return false;
        }

        Data.itemList.splice(deletedItemindex, 1)
        return true;
    }
}

export const CheckBoxList = {
    init() {
        Data.checkBoxList = [];
    },
    get() {
        return Data.checkBoxList;
    },
    push(checkbox) {
        Data.checkBoxList.push(checkbox)
    },
    set(items) {
        Data.checkBoxList = items;
    },
    delete(date, number) {
        let deletedItemindex;
        Data.checkBoxList.forEach((item) => {
            if (
                item.getAttribute('data-date') == date && 
                item.getAttribute('data-number') == String(number)
            ) {
                deletedItemindex = Data.checkBoxList.indexOf(item);
                return;
            }
        })

        if (deletedItemindex == undefined) {
            return false;
        }

        Data.checkBoxList.splice(deletedItemindex, 1)
        return true;
    }
}

export const SearchedItems = {
    init() {
        Data.searchedItemList = [];
    },
    get() {
        return Data.searchedItemList;
    },
    push(itemCode, itemName) {
        Data.searchedItemList.push(
            {itemCode: itemCode, itemName: itemName}
        )
    },
    set(items) {
        Data.searchedItemList = items;
    },
    delete(code) {
        Data.searchedItemList = Data.searchedItemList.filter(item => item.itemCode !== code);
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