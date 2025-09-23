import { login as loginAPI } from '../apis/login'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { Notyf } from 'notyf';
import { User } from '../utils/types'
import { useAuth } from '../components/AuthProvide'
import 'notyf/notyf.min.css';
import { loadToken, loadUser } from '../utils/localStorageOpt';

export default function Login(){
    const Navigate = useNavigate()
    const auth = useAuth()
    const notify = new Notyf

    //跳转到注册
    function handleNavigate(){
        Navigate('/register')
    }

    //表单提交
    function onFinish(formdata:User){
        notify.success('正在登录...')
        //之后在这里写向后端数据库请求登录的请求


        //这里使用用户密码是不安全的，前端的登录函数只起存token和提供用户名的作用，真正的验证在后端进行
        auth.loginFunction(formdata.username, '1')
        Navigate('/')
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