import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvide"
import { ReactNode } from "react"

//子组件为受保护路由,检查当前用户是否有权限访问
export default function Protect({ children }: { children: ReactNode }){
    const auth = useAuth()
    const isAuthorized = auth.isAuthorized
    if(isAuthorized)return <>{ children }</>
    else return <Navigate to = '/login'/>
}