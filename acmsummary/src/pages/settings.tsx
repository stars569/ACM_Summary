import React, { useState } from 'react'
import { useAuth } from '../components/AuthProvide'
import { deleteUserAPI, changePasswordAPI } from '../apis/users'
import { Notyf } from 'notyf'
import { AxiosError } from 'axios'
import { changePasswordData, errorResponse } from '../utils/types'
import { Form, Input, Button, Card, Modal } from 'antd'
import { LockOutlined } from '@ant-design/icons';

export default function Settings(){

    const auth = useAuth()

    const notify = new Notyf()
    
    const [visible, setVisible] = useState(false)

    async function handleOk(){
        await handleDelete()
        setVisible(false)
    }

    function handleCancel(){
        setVisible(false)
    }

    function handleLogOut(){
        auth.logoutFunction()
    }

    function handleUserDelete(){
        setVisible(true)
    }

    async function handleDelete(){
        try{
            if(auth.user === null || auth.user.userId === null){
                notify.error('获取用户信息失败')
                return
            }
            const res = await deleteUserAPI(auth.user.userId, auth.token)
            notify.success(res.message)
            auth.logoutFunction()
        }
        catch(error){
            const tsError = error as AxiosError
            if(tsError.response){
                const data = tsError.response.data as errorResponse
                notify.error(data.message)
            }
            else{
                notify.error('服务器未响应')
            }
        }
    }

    function onFinishFailed(){
        notify.error('新旧密码不能为空')
    }

    async function onFinish(data: changePasswordData){
        try{
            if(auth.user === null || auth.user.userId === null){
                notify.error('获取用户信息失败')
                return
            }
            const res = await changePasswordAPI(data, auth.user.userId, auth.token)
            notify.success(res.message)
            auth.logoutFunction()
        }
        catch(error){
            const tsError = error as AxiosError
            if(tsError.response){
                const data = tsError.response.data as errorResponse
                notify.error(data.message)
            }
            else{
                notify.error('服务器未响应')
            }
        }
    }

    return (
        <div className="flex space-x-4 bg-gray-50">
            <Modal
                title="确认"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>确定注销账户?</p>
                <p>注销后不可找回</p>
            </Modal>
            <Card title='设置' className="w-full">
                <div className="flex space-x-4">
                    <Card className='flex-col flex-1' title='账户操作'>
                        <div className="flex flex-col space-y-4">
                            <Button 
                                onClick={handleLogOut} 
                                size="large"
                                className="flex items-center justify-center"
                            >
                                退出登录
                            </Button>
                            <Button 
                                onClick={handleUserDelete} 
                                size="large"
                                danger
                                className="flex items-center justify-center"
                            >
                                注销账户
                            </Button>
                        </div>
                    </Card>
                    <Card className='flex-col flex-1' title='修改密码'>
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
                            name="oldPassword"
                            rules={[{ required: true, message: '请输入旧密码' }]}
                            >
                                <Input prefix = {<LockOutlined/>} placeholder='旧密码'/>
                            </Form.Item>
                            <Form.Item
                            name="newPassword"
                            rules={[{ required: true, message: '请输入新密码' }]}
                            >
                                <Input prefix = {<LockOutlined/>} placeholder='新密码'/>
                            </Form.Item>
                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" className = "active:bg-blue-800 active:scale-90">
                                    更改密码
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Card>
        </div>
    )
}