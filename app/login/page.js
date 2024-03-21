'use client';
import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/navigation'

const boxStyle = {
  width: '100%',
  height: 500,
  borderRadius: 6,
  border: '1px solid #40a9ff',
};
const App = () => {
  const [loginState, serLoginState] = useState(true); //测试阶段默认登陆成功
  const router = useRouter();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    if(loginState)
      router.push('/allFund')
  };
  return (
    <Flex gap="middle" vertical justify='center' align='center' style={boxStyle}>

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名：',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码：',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            忘记密码？
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
          </Button>
          <p>
            还没有账号？
            <Link href={"/register"}>点这里立即注册</Link>
          </p>
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default App;