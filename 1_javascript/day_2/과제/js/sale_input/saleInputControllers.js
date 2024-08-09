import { Data, MODIFICAION_TYPE } from "./saleInputModels.js";

export const PageStatus = {
    get() {
        return Data.pageStatus;
    },
    setModification() {
        Data.pageStatus = MODIFICAION_TYPE;
    },
    checkModificationStatus() {
        return Data.pageStatus == MODIFICAION_TYPE ? true : false;
    }
}

export const SearchedItems = {
    init() {
        Data.searchedItemList = [];
    },
    get() {
        return Data.searchedItemList;
    },
    delete(code) {
        Data.searchedItemList = Data.searchedItemList.filter(item => item.itemCode !== code);
    },
    findFirst() {
        if (Data.searchedItemList.length <= 0) {
            alert('품목이 없습니다');
            return
        }

        return Data.searchedItemList[0];
    },
    getItem(code) {
        let targetItem;

        this.get().forEach((item) => {
            if (String(code) == item.itemCode) {
                targetItem = item;
            }
        })

        return targetItem;
    },
    push(itemCode, itemName) {
        Data.searchedItemList.push(
            {itemCode: itemCode, itemName: itemName}
        )
    },
    set(items) {
        Data.searchedItemList = items;
    },
    size() {
        return Data.searchedItemList.length;
    }
}

export const Specification = {
    date: {
        get() {
            return Data.specification.date;
        },
        set(date) {
            Data.specification.date = date;
        }
    },
    number: {
        get() {
            return Data.specification.number;
        },
        set(number) {
            Data.specification.number = number;
        }
    },
    code: {
        get() {
            return Data.specification.code;
        },
        set(value) {
            Data.specification.code = value;
        }
    },

    name: {
        get() {
            return Data.specification.name;
        },
        set(value) {
            Data.specification.name = value;
        }
    },

    quantity: {
        get() {
            return Data.specification.quantity;
        },
        set(value) {
            Data.specification.quantity = value;
        }
    },

    price: {
        get() {
            return Data.specification.price;
        },
        set(value) {
            Data.specification.price = value;
        }
    },

    briefs: {
        get() {
            return Data.specification.briefs;
        },
        set(value) {
            Data.specification.briefs = value;
        }
    }
    
}
