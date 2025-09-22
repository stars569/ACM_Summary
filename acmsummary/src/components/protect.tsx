import { ReactNode, useState, createContext } from 'react'
import { Navigate } from 'react-router-dom'

//权限检测，无权限跳回Login
export default function Auth( { children }: { children: ReactNode } ){
    const [isAuthorized, setIsAuthorized] = useState(false)
    const AuthInfo = createContext<undefined | boolean>(undefined)
    if(!isAuthorized)return <Navigate to = '/login' />
    else return <AuthInfo.Provider value = {isAuthorized}>{children}</AuthInfo.Provider>
}