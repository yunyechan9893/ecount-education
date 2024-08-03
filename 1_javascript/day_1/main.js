alert("hello ecount!")

let obj = {
    name:"예찬",
    say() {
        console.log("hello" + this.name)
    }
}

obj.say();

const say = obj.say;
say();


let obj2 = {
    name:"예찬",
    say: () => {
        console.log("hello" + this.name)
    }
}

const say = obj2.say;
say();