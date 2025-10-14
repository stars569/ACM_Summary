export function strCombine(...strs: string[]){
    return strs.join(' ')
}

export function strExtract(str: string){
    const strHandle = str.slice(1, str.length - 1)
    const strArr = strHandle.split(',')
    strArr[0] = strArr[0].slice(1, strArr[0].length - 1)
    strArr[1] = strArr[1].slice(1, strArr[1].length - 1)
    return strArr.toString()
}