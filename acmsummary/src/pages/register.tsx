import { useNavigate } from 'react-router-dom'

export default function Register(){
    const navigate = useNavigate()

    //跳转到登录
    function handleNavigate(){
        navigate('/login')
    }
    return (
        <div>
            <div>this is register</div>
            <div onClick = {handleNavigate}>Click to login</div>
        </div>
    )
}