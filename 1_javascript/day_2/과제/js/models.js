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