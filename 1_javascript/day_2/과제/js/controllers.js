import { Item } from './models.js'

const item = new Item();


export class ItemController {

    select(code) {
        let items = item.getItems();
        let index = -1;

        items.forEach((item, idx) => {
            if (item.code === code) {
                console.log(item.code, code)
                index = idx;
            }
        });

        return index;
    }

    push(code, name) {
        const index = this.select(code);
        if ( index >= 0 ) {
            return false
        }


        let items = item.getItems();
        items.push({code: code, name: name}) 
        item.setItems(items);
        return true
    }

    delete(code) {
        let indexToDelete = this.select(code);

        if (indexToDelete == -1) {
            return false
        }
        
        let items = item.getItems();
        items.splice(indexToDelete, 1);
        item.setItems(items);
        return true
    }
}