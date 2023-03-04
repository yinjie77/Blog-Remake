import React from "react"
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Checkbox } from 'antd';
const LoginForm = (props) => {
  const [username, setUsersname] = useState('')
  const [password, setPassword] = useState('')
  const [noLogin, setNoLogin] = useState(false)
  const handleLogin = () => {
    props.login(username, password, noLogin)
  }
  const handleNoLogin = () => [
    setNoLogin(!noLogin)
  ]
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Form
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        style={{ width: '100%', margin: '10px 14px' }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入你的帐号' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="帐号"
            onChange={({ target }) => {
              setUsersname(target.value)
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入你的密码' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="密码"
            onChange={({ target }) => {
              setPassword(target.value)
            }}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox onChange={handleNoLogin}>7天内免登录</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: 'rgb(92, 100, 164)', borderColor: 'rgb(92, 100, 164)' }}
          >
            登录
          </Button>
          {'   '}或{' '}
          <Button type="link" onClick={() => props.setModalState('注册')} style={{ color: 'rgb(92, 100, 164)' }}>
            现在注册
          </Button>{' '}
        </Form.Item>
      </Form>
    </div>

  )

}

export default LoginForm