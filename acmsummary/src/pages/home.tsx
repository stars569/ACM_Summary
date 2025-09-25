import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvide'

export default function Home(){
    const auth = useAuth()
    const navigate = useNavigate()

    function handleClick(){
        auth.logoutFunction()
    }

    return (
        <div>
            <div>this is home</div>
            <button onClick = {handleClick}>Click to logout</button>
        </div>
    )
}