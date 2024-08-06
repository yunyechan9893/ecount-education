import { Item, Specification } from './models.js'

const item = new Item();

export class ItemController {

    select(code) {
        let items = item.getItems();
        let index = -1;

        items.forEach((item, idx) => {
            if (item.code === code) {
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

    alter(code,name) {
        const index = this.select(code, name);

        if ( index < 0 ) {
            return false
        }

        let items = item.getItems();
        items = items.filter(item => item.code !== code)
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

    getAll() {
        return item.getItems();
    }

    searchItems = (itemCodeValue, itemNameValue) => {
        const itemList = this.getAll();

        return itemList.filter(item => {
            // 품목코드와 품목이름을 기반으로 필터링
            const matchesCode = itemCodeValue === '' || item.code === itemCodeValue;
            const matchesName = itemNameValue === '' || item.name.includes(itemNameValue);
            return matchesCode && matchesName;
        });
    };
}

const specification = new Specification();
export class SpecificationController {

    exist(date, number) {
        let specifications = specification.get();

        specifications.forEach((specification) => {
            if (specification.date == date && specification.number == number) {
                return true
            }
        })

        return false
    }

    select(date, number) {
        let specifications = specification.get();

        specifications.forEach((specification, idx) => {
            if (specification.date == date && specification.number == number) {
                return idx
            }
        })

        return -1
    }

    selectLastNumber(date) {
        let specifications = specification.get();
        let number = 1;

        specifications.forEach((specification) => {
            if (specification.date === date) {
                number += 1;
            }
        });

        return number;
    }

    push(date, code, name, quantity, price, briefs) {
        const number = this.selectLastNumber(date);

        if ( number <= 0 ) {
            return false
        }

        let specifications = specification.get();

        specifications.push({
            date: date,
            number: number,
            code: code,
            name: name,
            quantity: quantity, 
            price: price, 
            briefs: briefs}) 

        specification.set(specifications);
        return true
    }

    alter(date, number, code, name, quantity, price, briefs) {
        const isExist = this.exist(date, number);

        if ( !isExist ) { // 명세서가 존재하지 않음
            return false
        }

        let specifications = specification.get();
        specifications = specifications.filter(
            specification => specification.date !== date && specification.number !== number)
        
        specifications.push({
            date: date,
            number: number,
            code: code,
            name: name,
            quantity: quantity, 
            price: price, 
            briefs: briefs})

        specification.set(specifications);
        return true
    }

    delete(date, number) {
        let indexToDelete = this.select(date, number);

        if (indexToDelete.length < 0) {
            return false
        }
        
        let specifications = specification.get();
        specifications.splice(indexToDelete, 1);
        specification.set(specifications);
        return true
    }

    getAll() {
        return specification.get();
    }

    search(startDate, endDate, itemCode, itemName, briefs) {
        // 모든 사양 정보를 가져옵니다
        const specifications = this.getAll();
    
        // 필터링을 위한 조건 함수를 정의합니다
        const filterFunction = (item) => {
            // 날짜 필터링
            const start = new Date(startDate);
            const end = new Date(endDate);
            const itemDate = new Date(item.date);

            // 날짜 비교
            if (itemDate < start || itemDate > end) {
                return false;
            }
    
            if (itemCode && String(item.code) !== itemCode) {
                return false;
            }

            if (briefs && (!item.briefs || !item.briefs.includes(briefs))) {
                return false;
            }
    
            // 모든 조건을 통과하면 true를 반환
            return true;
        };
    
        // specifications.data를 필터링합니다
        const filteredSpecifications = specifications.filter(filterFunction);
        
        return filteredSpecifications;
    }
}