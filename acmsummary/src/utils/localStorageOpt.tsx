import { User } from './types'

function loadUser(): User | null{
    try{
        const user = localStorage.getItem('user')
        if(user === null || user === undefined)return null
        const userObj = JSON.parse(user)
        return userObj
    }
    catch(error){
        console.log('读取用户名失败:', error)
        return null
    }
}

function loadToken(): string | null{
    try{
        const token = localStorage.getItem('token')
        if(token !== null || token === undefined)return token
        else return null
    }
    catch(error){
        console.log('读取token失败:', error)
        return null
    }
}

function loadUserId(): number | null{
    try{
        const userId = localStorage.getItem('userId')
        if(userId !== null || userId === undefined)return parseInt(userId)
        else return null
    }
    catch(error){
        console.log('读取用户id失败:', error)
        return null
    }
}

export {
    loadUser,
    loadToken,
    loadUserId
}