import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Card } from 'antd'
import { getQuestionData } from '../apis/questions'
import { useAuth } from '../components/AuthProvide'
import { questionDataFeedback, errorResponse, linearChartData } from '../utils/types'
import { AxiosError } from 'axios'
import { Notyf } from 'notyf'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { getChart } from '../utils/historyDataHandler'

export default function Home(){

    const notify = new Notyf()

    const auth = useAuth()

    const [questionData, setQuestionData] = useState<questionDataFeedback[]>([])

    const chartWidth = 1350

    const chartHeight = 200

    useEffect(() => {
        async function getHistoryData(){
            try{
                if(auth.user === null || auth.user.userId === null){
                    notify.error('获取用户信息失败')
                    return
                }
                const result = await getQuestionData(auth.user.userId, auth.token)
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <h1 className='text-4xl text-center font-light text-indigo-800 mb-8'>Welcome to ACMsummary!</h1>
            <Card className='w-full shadow-xl rounded-lg border-0' title={
                <div className="text-xl font-semibold text-gray-800">刷题记录统计图</div>
            }>
                <div className="space-y-8 -mx-6">
                    <div className="rounded-lg">
                        <div className="text-lg font-medium text-gray-700 px-6">刷题数量</div>
                        <AreaChart width={chartWidth} height={chartHeight} data={getChart(questionData).count}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </div>
                    
                    <div className="p-4 rounded-lg">
                        <div className="text-lg font-medium text-gray-700px-6">平均做题难易度</div>
                        <AreaChart width={chartWidth} height={chartHeight} data={getChart(questionData).ave}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv2)" />
                            <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv2)" />
                        </AreaChart>
                    </div>
                    <div className="p-4 rounded-lg text-center">
                        <div className="text-xl font-semibold text-indigo-700">总刷题数: <span className="text-2xl">{questionData.length}</span></div>
                    </div>
                </div>
            </Card>
        </div>
    )
}