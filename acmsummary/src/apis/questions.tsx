import axios from "axios"
import { questionInfoSubmit } from "../utils/types";

//存储题目数据
export async function uploadQuestion(data:questionInfoSubmit, token:string | null){
    try{
        const result = await axios.post('http://localhost:8080/api/add', {
            data
        }, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return result.data
    }
    catch(error){
        throw error
    }
}

//获取所有题目数据
export async function getQuestionData(userId: number, token:string | null){
    try{
        const result = await axios.get(`http://localhost:8080/api/question/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return result.data
    }
    catch(error){
        throw error
    }
}

//根据id删除指定题目
export async function deleteQuestionAPI(id: number, userId:number, token: string | null){
    try{
        const result = await axios.delete(`http://localhost:8080/api/delete/${id}/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return result.data
    }
    catch(error){
        throw error
    }
}

//根据id获取指定题目
export async function getQuestionByIdAPI(id: number, userId: number, token: string | null){
    try{
        const res = await axios.get(`http://localhost:8080/api/questionGet/${id}/${userId}`, {
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

//根据id更新题目复习信息
export async function updateQuestionByIdAPI(id: number, userId: number, token: string | null){
    try{
        const res = await axios.post('http://localhost:8080/api/update', {
            id: id,
            userId: userId
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

//根据id提交评论
export async function changeCommentAPI(id: number, userId: number, comment: string, token: string | null){
    try{
        const res = await axios.post('http://localhost:8080/api/comment', {
            id: id,
            userId: userId,
            comment: comment
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