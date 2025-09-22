import axios from 'axios'

//登录api
async function login(username:string, password:string){
    const res = await axios.post('http://localhost:8080/server/login', {
        username: username,
        password: password
    })
    return res
}

export {
    login
}