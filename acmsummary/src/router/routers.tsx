import { createBrowserRouter } from 'react-router-dom'
import Protect from '../components/protect'
import Login from '../pages/login'
import Home from '../pages/home'
import Register from '../pages/register'

export default createBrowserRouter([
    {
        path: '/',
        element: <Protect><Home /></Protect>
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