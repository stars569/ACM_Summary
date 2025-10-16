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

export function generateURL(resource: string){
    const codeforces = /^[A-Z]{2}\d{4}[A-Z]$/
    const luogu = /^[A-Z]\d{4}$/
    const atc =  /^[a-z]+(\d+)_([a-z])$/
    if(codeforces.test(resource)){
        const tailfix = resource.slice(2, resource.length - 1)
        return `https://codeforces.com/problemset/problem/${tailfix}/${resource.at(resource.length - 1)}`
    }
    else if(luogu.test(resource)){
        return `https://www.luogu.com.cn/problem/${resource}`
    }
    else if(atc.test(resource)){
        const prefix = resource.split('_')
        return `https://atcoder.jp/contests/${prefix[0]}/tasks/${resource}`
    }
}