import React from 'react'
import { loginAPI } from '../apis/users'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card } from 'antd'
import { Notyf } from 'notyf';
import { errorResponse, loginUser } from '../utils/types'
import { useAuth } from '../components/AuthProvide'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import 'notyf/notyf.min.css';
import { AxiosError } from 'axios';

export default function Login(){
    const navigate = useNavigate()
    const auth = useAuth()
    const notify = new Notyf()

    //表单提交
    async function onFinish(formdata:loginUser){
        try{
            const result = await loginAPI(formdata.username, formdata.password)
            notify.success(result.message)
            auth.loginFunction(result.user.username, result.token)
            navigate('/')
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
    }
    function onFinishFailed(){
        notify.error('用户名或密码不能为空')
    }

    return (
        <div className = "flex items-center justify-around bg-gradient-to-b from-purple-600 to-blue-100 text-lg h-screen bg-cover bg-no-repeat">
            <div className = "items-center">
                <Card title = "ACM-Platform Login" className = "w-[500px] h-[300px] text-center space-y-5 shadow-2xl hover:ring-2">
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
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                        <Input prefix = {<UserOutlined/>} placeholder='username'/>
                        </Form.Item>

                        <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                        <Input.Password prefix = {<LockOutlined/>} placeholder='password'/>
                        </Form.Item>

                        <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className = "active:bg-blue-800 active:scale-90">
                            登录
                        </Button>
                        </Form.Item>
                        <a href = "/register" className = "hover:underline">Register now!</a>
                    </Form>
                </Card>
            </div>
        </div>
    )
}