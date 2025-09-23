import { useAuth } from '../components/AuthProvide'

export default function Home(){
    const auth = useAuth()

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