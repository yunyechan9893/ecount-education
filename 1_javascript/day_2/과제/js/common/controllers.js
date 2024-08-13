import { Item, Specification, Index, Member, Token } from './models.js'
import { generateUUID } from './utils.js'

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
        const items = item.getItems();
        this.sort(items);
        return items;
    }
    
    sort(items) {
        items.sort(function(item1, item2) {
            if (item1.code < item2.code) {
                return -1;
            } else if (item1.code > item2.code) {
                return 1;
            } else {
                return 0;
            }
        });
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
const index = new Index();
export class SpecificationController {

    number = {
        set(date) {
            let numbers = index.specification.get();

            const existingEntry = numbers.find(entry => entry.date === date);

            if (existingEntry) {
                // 기존에 date가 있으면 인덱스를 1 증가시킵니다
                existingEntry.index += 1;
                index.specification.set(numbers);
                return existingEntry.index;
            } 
            
            numbers.push({ date: date, index: 1 });
            index.specification.set(numbers);

            return 1;
        }
    }

    exist(date, number) {
        let isExisted = false;

        specification.get().forEach((specification) => {
            if (specification.date == date && String(specification.number) == String(number)) {
                isExisted = true
            }
        })

        return isExisted;
    }

    select(date, number) {
        let selectedIndex = -1;
        specification.get().forEach((specification, idx) => {
            if (
                specification.date === date && 
                String(specification.number) === String(number)
            ) {
                selectedIndex = idx;
                return;
            }
        })

        return selectedIndex;
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
        let number = this.number.set(date);
    
        if ( number <= 0 ) {
            return false
        }

        
        let specifications = specification.get();

        console.log(number)
        number = Number(number);
        quantity = Number(quantity);
        price = Number(price);

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
        // 명세서가 존재하는지 확인
        if (!this.exist(date, number)) {
            return false;
        }
    
        // 명세서 삭제 및 업데이트
        this.delete(date, number);
        
        // 숫자 형식으로 변환 (필요할 경우)
        number = Number(number);
        quantity = Number(quantity);
        price = Number(price);
    
        // 새로운 사양 추가
        const newSpecification = { date, number, code, name, quantity, price, briefs };
        const specifications = [...specification.get(), newSpecification];
    
        // 명세서 저장
        specification.set(specifications);
        
        return true;
    }

    delete(date, number) {
        let indexToDelete = this.select(date, number);

        if (indexToDelete < 0) {
            return false
        }
        
        let specifications = specification.get();
        specifications.splice(indexToDelete, 1);
        specification.set(specifications);
        return true
    }

    getAll() {
        const specifications = specification.get();
        this.sort(specifications);

        console.log(specifications)
        return specifications;
    }

    sort(specifications) {
        specifications.sort(function(item1, item2) {
            if (item1.date < item2.date) {
                return 1; 
            } else if (item1.date > item2.date) {
                return -1;
            } else {
                if (item1.number < item2.number) {
                    return 1;
                } else if (item1.number > item2.number) {
                    return -1; 
                } else {
                    return 0; 
                }
            }
        });
    }

    search(startDate, endDate, items, briefs) {
        // 모든 사양 정보를 가져옵니다
        const specifications = this.getAll();

        if (items.length > 0) {
            const filteredSpecifications = [];
            items.forEach((item) => {
                const itemCode = item.itemCode
                const filter = this.getFilter(startDate, endDate, itemCode, briefs)
                filteredSpecifications.push(specifications.filter(filter));
            })
            return filteredSpecifications.flat();
        }

        const filter = this.getFilter(startDate, endDate, null, briefs)
        const filteredSpecifications = specifications.filter(filter);
        return filteredSpecifications;
    }

    getFilter(startDate, endDate, itemCode, briefs) {
        return (item) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const itemDate = new Date(item.date);

            if (itemDate < start || itemDate > end) {
                return false;
            }
    
            if (itemCode && String(item.code) !== itemCode) {
                return false;
            }

            if (briefs && (!item.briefs || !item.briefs.includes(briefs))) {
                return false;
            }
    
            return true;
        };
    }
}

export const MemberController = {
    create(
        company,
        name,
        email,
        password
    ) {
        if (this.duplication(email)) {
            return false;
        }
        const members = Member.get();
        members.push({
            company: company,
            name: name,
            email: email,
            password: password
        });

        Member.set(members);

        return true;
    },

    getAll() {
        return Member.get();
    },

    duplication(email) {
        return this.getAll().some(item => item.email == email);
    },

    equls(
        company,
        name,
        password
    ) {
        return this.getAll().some(item => 
            item.company === company && 
            item.name === name && 
            item.password === password
        );
    },
}

export const TokenController = {
    create() {
        const token = generateUUID();
        Token.set({token: token});
    },

    exist() {
        console.log(Token.get())
        return Token.get();
    }
}