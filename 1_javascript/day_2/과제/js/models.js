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
        console.log(specifications)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(specifications));
    }
    
};