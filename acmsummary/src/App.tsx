import React from 'react'
import routers from './router/routers'
import { RouterProvider } from 'react-router-dom';
import Auth from './components/AuthProvide'

export default function app(){
    return (
        <Auth>
            <RouterProvider router = {routers} />
        </Auth>
    )
}