import { loginAPI } from '../apis/users'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { Notyf } from 'notyf';
import { errorResponse, loginUser } from '../utils/types'
import { useAuth } from '../components/AuthProvide'
import 'notyf/notyf.min.css';
import { AxiosError } from 'axios';

export default function Login(){
    const navigate = useNavigate()
    const auth = useAuth()
    const notify = new Notyf()

    //跳转到注册
    function handleNavigate(){
        navigate('/register')
    }

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
        <div>
            <div>this is login</div>
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
                label="用户名"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
            <div onClick = {handleNavigate}>to register</div>
        </div>
    )
}