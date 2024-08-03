function delay(ms) {
    return new Promise((resolve) => 
        setTimeout(()=> 
            resolve()
        , ms)
    )
}
  
function alert () {
    console.log('실행완료')
}

async function test (ms) {
    await setTimeout(() => {}, ms);
    await console.log("??")
    await alert();
}

test (3000)