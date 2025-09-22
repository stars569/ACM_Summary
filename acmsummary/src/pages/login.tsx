import { login as loginAPI } from '../apis/login'

export default function login(){
    const username = 'aaaaa'
    const password = '11111'
    async function handleLogin(){
        const res = await loginAPI(username, password)
        console.log(res)
    } 
    return (
        <div>
            <div>this is login</div>
            <button onClick = {handleLogin}>Click</button>
        </div>
    )
}