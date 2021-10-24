let string = "abababcbbb";
let letter = 'c';
let find = findLastSubString(string, letter);

console.log(find);

function findLastSubString(str, substr){
    let ret = -1;
    for(let i = str.length-substr.length+1; i > 0; i--){
        if(str.substring(i-substr.length, i) === substr){
            return (i - substr.length);
        }
    }
    return ret;
}