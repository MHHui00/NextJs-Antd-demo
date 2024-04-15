'use client';
import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';
import Link from 'next/link';
import { useRouter, redirect } from 'next/navigation'
import { useLoginStore } from '@/store/useLoginStore';

const boxStyle = {
  width: '100%',
  height: 500,
  borderRadius: 6,
  border: '1px solid #40a9ff',
};
const App = () => {
  const loginStatus = useLoginStore(state => state.loginStatus);

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const loginFailed = () => {
    messageApi.open({
      type: 'error',
      content: '登陆失败，请重试',
    });
  };
  const loginRemind = () => {
    messageApi.open({
      type: 'error',
      content: '请先登陆',
    });
  };

  async function onFinish(values) {
    try {
      const response = await fetch(`/api/login?username=${values.username}&password=${values.password}`);
      if (response.ok) {
        const jsonData = await response.text(); // 先获取文本内容
        try {
          const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
          console.log(obj);
          useLoginStore.setState({ loginStatus: true });
          useLoginStore.setState({ userName: obj.username });
          useLoginStore.setState({ userId: obj.uid });
          router.push('/');

        } catch (error) {
          console.error("Parsing error:", error);
        }
      } else {
        () => { loginFailed }
        console.error("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Fetching error:", error);
    }
  };

  useEffect(() => {
    if (loginStatus) {
      router.push('/allFund');
    }
    ()=>loginRemind();
  }, [loginStatus, router]);

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
          {contextHolder}
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