import { Button } from 'antd'
import { useAuth } from '../components/AuthProvide'

export default function Settings(){

    const auth = useAuth()

    function handleClick(){
        auth.logoutFunction()
    }

    return (
        <div>
            <div>this is settings</div>
            <Button onClick = {handleClick}>Click</Button>
        </div>
    )
}