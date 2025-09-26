import axios from "axios"
import { questionInfoSubmit } from "../utils/types";

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