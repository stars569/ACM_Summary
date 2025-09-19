import routers from './router/routers'
import { RouterProvider } from 'react-router-dom';

export default function app(){
    return (
        <RouterProvider router = {routers} />
    )
}