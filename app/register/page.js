"use client";
import React, { useState } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Flex,
  message
} from 'antd';
import Link from 'next/link';
import md5 from 'crypto-js/md5';
import { useRouter } from 'next/navigation';

const { Option } = Select;
const boxStyle = {
  width: '100%',
  height: 500,
  borderRadius: 6,
  border: '1px solid #40a9ff',
};

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const App = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const onFinish = async (values) => {
    // console.log('Received values of form: ', values);
    const encryptedPassword = md5(values.password).toString()

    try {
      const response = await fetch(`/api/register?username=${values.username}&password=${encryptedPassword}`, {
        method: 'POST', // 确保使用正确的 HTTP 方法
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        // const jsonData = await response.text(); // 先获取文本内容
        messageApi.open({
          type: 'success',
          content: data.message + '，即将跳转到登陆页',
        });
        setTimeout(()=>{
          router.push('/login');
        }, 2000)
      } else {
        messageApi.open({
          type: 'error',
          content: data.message,
        });
      }
    } catch (error) {
      console.error("Fetching error:", error);
    }
  };
  // console.log(md5('password').toString());  //5f4dcc3b5aa765d61d8327deb882cf99

  return (
    <Flex gap="middle" vertical justify='center' align='center' style={boxStyle}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label="用户名"
          // tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: '请输入用户名：',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码：',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="再次确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再一次输入密码：',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {contextHolder}
          <Button type="primary" htmlType="submit">
            注册
          </Button>
          <p>
            已经有账号？
            <Link href={"/login"}>立即登陆</Link>
          </p>
        </Form.Item>
      </Form>
    </Flex>
  );
};
export default App;