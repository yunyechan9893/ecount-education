// var list = [{ value: 1 }, { value: 2 }];

// list.forEach(function (item) {
//     item.value2 = item.value + 1
//     // delete item.value

//     // item = {value2: item.value + 1 }

// });

// console.log(list);
// list -> [{ value2: 2 }, { value2: 3 }]

var list = [1,2,3,4,5];
var list2 = [];
var item;

for (var i = 0; i < list.length; i++) {
    item = list[i];
    list2.push(function () {
        console.log(item); // item의 주소값이 들어가는 것 직접 값이 들어가 있지 않다
    })
}

for (var i = 0; i < list2.length; i++) {
    list2[i]();
}