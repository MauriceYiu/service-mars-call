export default function (len, radix) {
    let value;
    for (let j = 0; j < 10; j++) {
        let randStr = "";
        for (let i = 0; i < 12; i++) { //此处的12为生成12位数字，可随即更改
            let randItem = Math.floor(Math.random() * 10);
            randStr += randItem;
        }
        let randStr2 = ""
        for (let i = 0; i < 4; i++) { //此处的12为生成12位数字，可随即更改
            let randItem2 = Math.floor(Math.random() * 10);
            randStr2 += randItem2;
        }
        value = randStr2 + randStr; //此处的766是要求必须已766开头，如果不需要可以去掉并在for循环中填入你要的位数
    }
    return value;
}