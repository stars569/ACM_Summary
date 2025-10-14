import React from 'react'
import { Form, Input, Button, Card, Cascader, DatePicker, Divider, Typography, List } from 'antd'
import { questionDataFeedback, questionInfo } from '../utils/types'
import { Notyf } from 'notyf'
import FormItem from 'antd/es/form/FormItem'
import { useAuth } from '../components/AuthProvide'
import { getQuestionData, uploadQuestion } from '../apis/questions'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { errorResponse } from '../utils/types'
import { useEffect, useState } from 'react'
import { strCombine, strExtract } from '../utils/strHandle'

export default function AddPage(){

    const notify = new Notyf()

    const navigate = useNavigate()

    const auth = useAuth()

    const [historyData, setHistoryData] = useState<questionDataFeedback[] | undefined>(undefined)

    //表单提交
    async function onFinish(formdata:questionInfo){
        if(formdata.difficulty % 100 !== 0 || formdata.difficulty < 800 || formdata.difficulty > 3300){
            notify.error('Please type in right difficulty')
            return 
        }
        const formattedData = {
            ...formdata,
            'solveTime': formdata.solveTime.$d
        }
        try{
            const result = await uploadQuestion(formattedData, auth.token)
            notify.success(result.message)
        }
        catch(error){
            const tsError = error as AxiosError

            //检查服务端是否有响应
            if(tsError.response){
                const data = tsError.response?.data as errorResponse
                notify.error(data.message) //有响应则返回错误信息
            }
            else{
                notify.error('服务器未响应')
            }
        }
        try{
            const result = await getQuestionData(auth.token)
            setHistoryData(result.data.rows)
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
    function onFinishFailed(){
        notify.error('提交失败')
    }

    //获取历史数据
    useEffect(() => {
        async function getHistoryData(){
            try{
                const result = await getQuestionData(auth.token)
                setHistoryData(result.data.rows)
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
            <Card>
                <Form
                    name="basic"
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 500 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    name="title"
                    rules={[{ required: true, message: '请输入题目标题!' }]}
                    >
                    <Input placeholder='题目标题'/>
                    </Form.Item>

                    <Form.Item
                    label="type"
                    rules = {[{ required: true }]}
                    name = 'type'
                    >
                    <Cascader
                    placeholder = '算法'
                    options={[
                        {
                            value: '算法基础',
                            label: '算法基础',
                            children: [
                                { value: '枚举', label: '枚举' },
                                { value: '模拟', label: '模拟' },
                                { value: '递归', label: '递归' },
                                { value: '分治', label: '分治' },
                                { value: '贪心', label: '贪心 ' },
                                { value: '排序', label: '排序' },
                                { value: '前缀和', label: '前缀和' },
                                { value: '差分', label: '差分' },
                                { value: '二分', label: '二分' },
                                { value: '倍增', label: '倍增' },
                                { value: '构造', label: '构造' }
                            ],
                        },
                        {
                            value:'动态规划DP',
                            label:'动态规划DP',
                            children:[
                                { value:'记忆化搜索', label:'记忆化搜索' },
                                { value:'背包DP', label:'背包DP' },
                                { value:'图上DP', label:'图上DP' },
                                { value:'数位DP', label:'数位DP' },
                                { value:'区间DP', label:'区间DP' },
                                { value:'树形DP', label:'树形DP' },
                                { value:'状压DP', label:'状压DP' },
                                { value:'插头DP', label:'插头DP' },
                                { value:'计数DP', label:'计数DP' },
                                { value:'动态DP', label:'动态DP' },
                                { value:'概率DP', label:'概率DP' },
                                { value:'DP套DP', label:'DP套DP' },
                                { value:'DP优化', label:'DP优化' },
                                { value:'其他DP', label:'其他DP' }
                            ]
                        },
                        {
                            value:'搜索',
                            label:'搜索',
                            children:[
                                { value:'BFS', label:'BFS' },
                                { value:'DFS', label:'DFS' },
                                { value:'剪枝', label:'剪枝' },
                                { value:'双向搜索', label:'双向搜索' },
                                { value:'启发式搜索', label:'启发式搜索' },
                                { value:'迭代加深搜索', label:'迭代加深搜索' },
                                { value:'DancingLinks', label:'DancingLinks' },
                                { value:'A*', label:'A*' },
                                { value:'IDA*', label:'IDA*' },
                                { value:'回溯法', label:'回溯法' },
                                { value:'Alpha-Beta剪枝', label:'Alpha-Beta剪枝' },
                            ]
                        },
                        {
                            value:'字符串',
                            label:'字符串',
                            children:[
                                { value:'字符串基础', label:'字符串基础' },
                            ]
                        }
                    ]}
                    />
                    </Form.Item>

                    <Form.Item
                    label="difficulty"
                    rules = {[{ required: true, message: '请输入问题难度!' }]}
                    name = "difficulty"
                    >
                    <Input placeholder='codeforces难度' />
                    </Form.Item>

                    <FormItem
                    label = "solveTime"
                    rules = {[{ required: true, message: '请选择完成日期!' }]}
                    name = "solveTime"
                    >
                    <DatePicker />
                    </FormItem>
                    <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" className = "active:bg-blue-800 active:scale-90">
                        添加题目
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card>
                <div className="text-lg">历史记录</div>
                <List
                    pagination={{ position:'bottom', align:'center', pageSize: 5 }}
                    dataSource={historyData}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                        title={<a href="https://oi-wiki.org/">{strExtract(item.type)}</a>}
                        description={item.title}
                        />
                        <div>难度:{item.difficulty}</div>
                    </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}