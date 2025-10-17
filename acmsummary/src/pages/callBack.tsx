import { Card, List, Button, Modal, Input, Form } from "antd";
import React, { useState, useEffect } from "react";
import { changeCommentAPI, getQuestionData, updateQuestionByIdAPI } from "../apis/questions";
import { useAuth } from "../components/AuthProvide";
import { Notyf } from "notyf";
import { commentType, errorResponse, questionDataFeedback } from "../utils/types";
import { cleanQuestionData, memoryToDay } from "../utils/historyDataHandler";
import { AxiosError } from "axios";
import { Check } from "lucide-react";
import { generateURL } from "../utils/strHandle";

export default function CallBack(){

    const [questions, setQuestions] = useState<questionDataFeedback[]>()

    const notify = new Notyf()

    const auth = useAuth()

    const [visible, setVisible] = useState(false)

    const [questionId, setQuestionId] = useState<number>(-1)

    async function getQuestions(){
        if(auth.user === null || auth.user.userId === null){
            notify.error('获取用户信息失败')
            return
        }
        try{
            const res = await getQuestionData(auth.user.userId, auth.token)
            const cleanedData = cleanQuestionData(res.data.rows, auth.user.difficulty)
            cleanedData.sort((a, b) => new Date(a.lastdone).getTime() - new Date(b.lastdone).getTime())
            console.log(cleanedData)
            setQuestions(cleanedData)
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

    async function handleCommentUpdate(id: number){
        setVisible(true)
        setQuestionId(id)
    }

    async function handleComment(id: number, comment: string){
        if(auth.user === null || auth.user.userId === null){
            notify.error('获取用户信息失败')
            return
        }
        try{
            const res = await changeCommentAPI(id, auth.user.userId, comment, auth.token)
            notify.success(res.message)
            getQuestions()
            setVisible(false)
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

    function handleCommentFail(){
        setVisible(false)
    }

    function onFinish(data: commentType){
        handleComment(questionId, data.comment)
    }

    return (
        <div>
            <Modal
                title="提交评论"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={visible}
                onCancel={handleCommentFail}
                footer={null}
            >
                <Form
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                >
                    <Form.Item
                    label="comment"
                    name="comment"
                    >
                    <Input placeholder="请输入评论"/>
                    </Form.Item>
                    <Form.Item label={null} className='text-center'>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
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
                        description={item.comment === '' ? '还未上传评论' : item.comment}
                        />
                        <Button onClick={() => handleCommentUpdate(item.id)}>评论该题目</Button>
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
                        description={item.comment === '' ? '还未上传评论' : item.comment}
                        />
                        <Button onClick={() => handleCommentUpdate(item.id)}>评论该题目</Button>
                        <Button icon={<Check />} className='bg-green-500' onClick={() => handleUpdateQuestion(item.id)}></Button>
                        </List.Item>
                    )
                }}
            />
            </Card>
        </div>
    )
}