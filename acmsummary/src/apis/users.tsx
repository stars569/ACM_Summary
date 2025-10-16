import axios from 'axios'
import { changePasswordData } from '../utils/types'

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

//注销api
async function deleteUserAPI(userId: number, token: string | null){
    try{
        const res = await axios.delete(`http://localhost:8080/server/delete/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return res.data
    }
    catch(error){
        throw error
    }
}

//更改密码api
async function changePasswordAPI(data: changePasswordData, userId: number, token: string | null){
    try{
        const res = await axios.post('http://localhost:8080/server/change', {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            id: userId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return res.data
    }
    catch(error){
        throw error
    }
}

//更改难度限制api
async function changeDifficultyAPI(userId: number, difficulty: number, token: string | null){
    try{
        const res = await axios.post('http://localhost:8080/server/changeDifficulty', {
            userId: userId,
            difficulty: difficulty
        }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return res.data
    }
    catch(error){
        throw error
    }
}

export {
    loginAPI,
    registerAPI,
    deleteUserAPI,
    changePasswordAPI,
    changeDifficultyAPI
}