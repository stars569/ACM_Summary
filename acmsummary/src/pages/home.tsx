import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Card } from 'antd'
import { getQuestionData } from '../apis/questions'
import { useAuth } from '../components/AuthProvide'
import { questionDataFeedback, errorResponse } from '../utils/types'
import { AxiosError } from 'axios'
import { Notyf } from 'notyf'

export default function Home(){

    const notify = new Notyf()

    const auth = useAuth()

    const [questionData, setQuestionData] = useState<questionDataFeedback[]>([])

    useEffect(() => {
        async function getHistoryData(){
            try{
                const result = await getQuestionData(auth.token)
                console.log(result.data.rows)
                setQuestionData(result.data.rows)
            }
            catch(error){
                const tsError = error as AxiosError
                if(tsError.response){
                    const data = tsError.response.data as errorResponse
                    notify.error(data.message)
                }
                else{
                    notify.error('获取数据失败')
                }
            }
        }
        getHistoryData()
    }, [])

    return (
        <div>
            <h1 className = 'text-4xl text-center font-light'>Welcome to ACMsummary!</h1>
            <Card className = 'fixed'>
                总做题数:{questionData.length}
            </Card>
        </div>
    )
}