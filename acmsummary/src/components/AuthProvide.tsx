import React from 'react'
import { ReactNode, useState, createContext, useEffect, useContext } from 'react'
import { loadUser, loadToken, loadUserId } from '../utils/localStorageOpt'
import { User, AuthInfo } from '../utils/types'

const Authorized = createContext<undefined | AuthInfo>(undefined)

//该组件对内提供上下文对象，使用useAuth钩子即可访问
export default function Auth( { children }: { children: ReactNode } ){

    const [user, setUser] = useState<null | User>(null)
    const [token, setToken] = useState<null | string>(null)

    useEffect(() => {
        async function loadInfo(){
            const localUser = await loadUser()
            const localToken = await loadToken()

            setUser(localUser)
            setToken(localToken)
        }
        
        loadInfo()
    }, [])

    //登录函数
    function loginFunction(username: string, userId: number, difficulty: number, newtoken:string){
        try{
            const newuser:User = {
                username:username,
                userId:userId,
                difficulty:difficulty
            }

            localStorage.setItem('user', JSON.stringify(newuser))
            localStorage.setItem('token', newtoken)

            setUser(newuser)
            setToken(newtoken)
        }
        catch(error){
            console.log('登录出错:', error)
        }
    }

    //退出登录函数
    function logoutFunction(){
        try{
            localStorage.removeItem('user')
            localStorage.removeItem('token')

            setUser(null)
            setToken(null)
        }
        catch(error){
            console.log('退出登录失败:', error)
        }
    }

    const value = {
        user,
        token,
        isAuthorized: !!user && !!token,
        loginFunction,
        logoutFunction
    }

    return <Authorized.Provider value = {value}>{ children }</Authorized.Provider>
}

//自定义钩子,访问上下文对象
export function useAuth(){
    const auth = useContext(Authorized)
    if(auth === undefined){
        throw new Error('useAuth钩子必须在权限提供组件内使用')
    }
    return auth
}