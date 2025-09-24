import axios, { AxiosError } from 'axios'

//登录api
async function loginAPI(username:string, password:string){
    try{
        const res = await axios.post('http://localhost:8080/server/login', {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }
    catch(error){
        throw error //在调用中处理错误
    }
}

//注册api
async function registerAPI(username:string, password:string){
    try{
        const res = await axios.post('http://localhost:8080/server/register',{
            username,
            password
        }, {
            headers:{
                'Content-Type': 'application/json'
            }
        })
        return res.data
    }
    catch(error){
        throw error //在调用中处理错误
    }
}

export {
    loginAPI,
    registerAPI
}