import React from 'react'
import { Home, Bolt, ChevronRight, CirclePlus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { strCombine } from '../utils/strHandle'
import { SideBarProp } from '../utils/types'

export default function SideBar(prop:SideBarProp){

    const location = useLocation()

    const { open, setOpen } = prop

    function handleMouseEnter(){
        setOpen(true)
    }

    function handleMouseLeave(){
        setOpen(false)
    }

    const navi = [
        {
            path:'/',
            icon:<Home />,
            description:'Home'
        },
        {
            path:'/add',
            icon:<CirclePlus />,
            description:'Add'
        },
        {
            path:'/settings',
            icon:<Bolt />,
            description:'Settings'
        }
    ]

    return (
        <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={strCombine('fixed inset-y-0 flex flex-col bg-blue-300 transition-all duration-300 text-center justify-center shadow-md', open ? 'w-64' : 'w-16')}>
            <h2 className="text-xl font-bold mb-4 pb-6 p-5">{open ? 'Navigator' : <ChevronRight />}</h2>
            <nav className="flex-1">
                {navi.map((item) => (
                    <Link
                        to={item.path}
                        key={item.path}
                        className={strCombine('group flex items-center px-5 py-4 rounded-md transition-colors duration-200', location.pathname === item.path ? 'bg-blue-500' : 'bg-blue-300')}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {open ? <span className="ml-3 text-sm font-medium">{item.description}</span> : <></>}
                    </Link>
                ))}
            </nav>

        </div>
    )
}