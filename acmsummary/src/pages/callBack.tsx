import { Card, List, Button } from "antd";
import React, { useState, useEffect } from "react";
import { getQuestionData, updateQuestionByIdAPI } from "../apis/questions";
import { useAuth } from "../components/AuthProvide";
import { Notyf } from "notyf";
import { errorResponse, questionDataFeedback } from "../utils/types";
import { cleanQuestionData, memoryToDay } from "../utils/historyDataHandler";
import { AxiosError } from "axios";
import { Check } from "lucide-react";
import { generateURL } from "../utils/strHandle";

export default function CallBack(){

    const [questions, setQuestions] = useState<questionDataFeedback[]>()

    const notify = new Notyf()

    const auth = useAuth()

    async function getQuestions(){
        if(auth.user === null || auth.user.userId === null){
            notify.error('获取用户信息失败')
            return
        }
        try{
            const res = await getQuestionData(auth.user.userId, auth.token)
            setQuestions(cleanQuestionData(res.data.rows, auth.user.difficulty))
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

    useEffect(() => {
        getQuestions()
    }, [])

    async function handleUpdateQuestion(id: number){
        try{
            if(auth.user === null || auth.user.userId === null){
                notify.error('获取用户信息失败')
                return 
            }
            const res = await updateQuestionByIdAPI(id, auth.user.userId, auth.token)
            getQuestions()
            notify.success(res.message)
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

    return (
        <div>
            <Card title='回顾做过的题目' extra='点击题目标题跳转,确认未遗忘做法则点击按钮,也可以对题目作评论'>
            <List
                itemLayout="horizontal"
                dataSource={questions}
                pagination={{ position:'bottom', align:'center', pageSize: 10 }}
                renderItem={(item, index) => {
                    const nowDate = new Date().getTime()
                    const itemDate = new Date(item.lastdone).getTime()
                    const day = Math.floor((nowDate - itemDate) / 86400000)
                    if(day < memoryToDay(item.memoryround))return <div></div>
                    else if(day === memoryToDay(item.memoryround))return (
                        <List.Item>
                        <List.Item.Meta
                        title={<div>
                            <a href={generateURL(item.resource)}>{item.resource}</a>
                        </div>}
                        description={item.type}
                        />
                        <Button icon={<Check />} className='bg-green-500' onClick={() => handleUpdateQuestion(item.id)}></Button>
                        </List.Item>
                    )
                    else return (
                        <List.Item>
                        <List.Item.Meta
                        title={<div>
                            <a href={generateURL(item.resource)} target="_blank">{item.resource}</a>
                            <div className="text-sm text-red-400">复习超时,上次复习于:{item.lastdone.toString().slice(0, 10)}</div>
                        </div>}
                        description={item.type}
                        />
                        <Button icon={<Check />} className='bg-green-500' onClick={() => handleUpdateQuestion(item.id)}></Button>
                        </List.Item>
                    )
                }}
            />
            </Card>
        </div>
    )
}