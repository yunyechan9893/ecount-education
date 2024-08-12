export class Item {
    STORAGE_KEY = 'item'

    getItems() {
        const items = localStorage.getItem(this.STORAGE_KEY);
        return items ? JSON.parse(items) : [];
    }

    setItems(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
    
};

export class Specification {
    STORAGE_KEY = 'specification'

    get() {
        const specifications = localStorage.getItem(this.STORAGE_KEY);
        return specifications ? JSON.parse(specifications) : [];
    }

    set(specifications) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(specifications));
    }
    
};

export class Index {
    specification = {
        STORAGE_KEY: 'specification_index',
        get() {
            const specifications = localStorage.getItem(this.STORAGE_KEY);
            return specifications ? JSON.parse(specifications) : [];
        },

        set(dates) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dates));
        }
    }
};

export const Member = {
    STORAGE_KEY: 'member',
    get() {
        const members = localStorage.getItem(this.STORAGE_KEY);
        return members ? JSON.parse(members) : [];
    },

    set(dates) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dates));
    }
};

export const Token = {
    STORAGE_KEY: 'token',
    get() {
        const tokenStorageString = localStorage.getItem(this.STORAGE_KEY);
        const tokenStorage = JSON.parse(tokenStorageString);

        return tokenStorage ? true : false;
    },

    set(dates) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dates));
    }
};