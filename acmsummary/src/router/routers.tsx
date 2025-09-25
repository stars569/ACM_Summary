import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/login'
import Home from '../pages/home'
import Register from '../pages/register'
import Protect from '../components/protected'
import Settings from '../pages/settings'

export default createBrowserRouter([
    {
        path: '/',
        element: <Protect><Home /></Protect>
    },
    {
        path: '/settings',
        element: <Protect><Settings /></Protect>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])