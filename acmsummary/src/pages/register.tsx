import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { Notyf } from 'notyf'
import { errorResponse, registerUser } from '../utils/types'
import { registerAPI } from '../apis/users'
import { AxiosError } from 'axios'

export default function Register(){
    const navigate = useNavigate()
    const notify = new Notyf()

    //跳转到登录
    function handleNavigate(){
        navigate('/login')
    }

    //表单提交
    async function onFinish(formdata:registerUser){
        if(formdata.password !== formdata.passwordConfirm){
            notify.error('两次密码输入不一致')
            return 
        }
        try{
            const result = await registerAPI(formdata.username, formdata.password)
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
        <div>
            <div>this is register</div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item
                label="PasswordConfirm"
                name="passwordConfirm"
                rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
            <div onClick = {handleNavigate}>Click to login</div>
        </div>
    )
}