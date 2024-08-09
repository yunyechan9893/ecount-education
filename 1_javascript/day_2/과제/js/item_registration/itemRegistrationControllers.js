import { Data, MODIFICAION_TYPE } from "./itemRegistrationModels.js";

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

export const CurrentItem = {
    get(){
        return Data.currentItem;
    },
    set(code, name) {
        Data.currentItem.code = code
        Data.currentItem.name = name

    }
}