import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvide"
import { ReactNode, useState } from "react"
import SideBar from "../pages/sideBar"
import { strCombine } from "../utils/strHandle"

//子组件为受保护路由,检查当前用户是否有权限访问
export default function Protect({ children }: { children: ReactNode }){
    const auth = useAuth()
    const isAuthorized = auth.isAuthorized

    const [open, setOpen] = useState(false)

    if(!isAuthorized) return <Navigate to = '/login'/>
    else return (
        <>
            <SideBar open = {open} setOpen = {setOpen}/>
            <div className = {strCombine('bg-gray-50 flex-1 flex flex-col overflow-hidden transition-all duration-300 p-4 h-screen', open ? 'ml-64' : 'ml-16')}>
                { children }
            </div>
        </>
    )
}