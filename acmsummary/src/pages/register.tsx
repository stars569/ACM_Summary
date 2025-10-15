import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card } from 'antd'
import { Notyf } from 'notyf'
import { errorResponse, registerUser } from '../utils/types'
import { registerAPI } from '../apis/users'
import { AxiosError } from 'axios'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function Register(){
    const navigate = useNavigate()
    const notify = new Notyf()

    //表单提交
    async function onFinish(formdata:registerUser){
        if(formdata.password !== formdata.passwordConfirm){
            notify.error('两次密码输入不一致')
            return 
        }
        try{
            await registerAPI(formdata.username, formdata.password)
            notify.success('注册成功')
            navigate('/login')
        }
        catch(error){
            const tsError = error as AxiosError

            //检查服务端是否有响应
            if(tsError.response){
                const data = tsError.response?.data as errorResponse
                notify.error(data.message) //有响应则返回错误信息
            }
            else{
                notify.error('服务端未响应')
            }
        }
    }
    async function onFinishFailed(){
        notify.error('注册失败')
    }

    return (
        <div className = "flex items-center justify-around bg-gradient-to-b from-purple-600 to-blue-100 text-lg h-screen bg-cover bg-no-repeat">
            <Card title = "ACM-Platform Register" className = "w-[500px] h-[350px] text-center space-y-5 shadow-2xl hover:ring-2">
                <Form
                    name="basic"
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
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

                    <Form.Item
                    name="passwordConfirm"
                    rules={[{ required: true, message: 'Please input your password again!' }]}
                    >
                    <Input.Password prefix = {<LockOutlined/>} placeholder='password confirm'/>
                    </Form.Item>

                    <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" className = "active:bg-blue-800 active:scale-90">
                        Submit
                    </Button>
                    </Form.Item>
                    <a href = "/login" className = "hover:underline">Login now</a>
                </Form>
            </Card>
        </div>
    )
}