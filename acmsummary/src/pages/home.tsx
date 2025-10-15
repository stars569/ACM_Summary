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
                const result = await getQuestionData(auth.token)
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
            <Card className='w-[1400px] h-[350px] fixed' title='刷题记录统计图'>
                <div>刷题数量</div>
                <AreaChart width={chartWidth} height={chartHeight} data={getChart(questionData).count}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
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
                    <div>平均做题难易度</div>
                    <AreaChart width={chartWidth} height={chartHeight} data={getChart(questionData).ave}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
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
            </Card>
        </div>
    )
}