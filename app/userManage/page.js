'use client'
import { Table, message, Popconfirm, Button, Form, Drawer, Col, Row, Input, Flex, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLoginStore } from '@/store/useLoginStore';
import { useRouter } from 'next/navigation'
import md5 from 'crypto-js/md5';


const boxStyle = {
  width: '100%',
  // height: 120,
  borderRadius: 6,
  // border: '1px solid #40a9ff',
};

const page = () => {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const router = useRouter();
  const [data, setData] = useState([]);
  //---

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const [openOpera, setOpenOpera] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0)// 传递点击的userID 
  const [selectedUserName, setSelectedUserName] = useState('')// 传递点击的userName 
  const [radioValue, setRadioValue] = useState(false);
  const [oldPassword, setOldPassword] = useState('');

  const showOpera = async (record) => {
    //打开时保存目标记录
    setSelectedUserName(record.username)
    setSelectedUserId(record.uid)
    setOldPassword(record.password)

    //填充表格
    form.setFieldsValue({ newPassword: record.password });
    setRadioValue(record.admin);

    //打开
    setOpenOpera(true);
  }
  const onCloseOpera = () => {
    setSelectedUserName('');
    setSelectedUserId(0);
    setOldPassword('')
    setOpenOpera(false);
  };

  const onFinish = async (values) => {
    values.privilege = JSON.parse(values.privilege);  //privilege如果使用默认值返回是boolean，但是经修改过后form收集回来会变成字符串。而字符串只包含 "true" 或 "false"所以JSON.parse可保证最后是boolean。
    // console.log(record);
    if (values.newPassword !== oldPassword) {
      values.newPassword = md5(values.newPassword).toString();    //
    }
    try {
      const response = await fetch(`/api/updateUser?uid=${selectedUserId}&password=${values.newPassword}&admin=${values.privilege}`, {
        method: 'POST', // 确保使用正确的 HTTP 方法
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: data.message,
        });
        onCloseOpera();
        setTimeout(() => {
          // router.refresh();  //好像不work
          window.location.reload();
        }, 2000)
      } else {
        messageApi.open({
          type: 'error',
          content: data.message,
        });
        // console.error("API call failed:", response.statusText);
      }
    } catch (error) {
      console.error("Fetching error:", error);
      setData({ error: "Failed to load data." }); // 设置错误信息，以便在页面上显示
    }

  }

  const deleteUser = async () => {
    console.log("deleted");
  }


  const onRadioChange = (e) => {
    // console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  const columns = [
    {
      title: '用户ID',
      width: '10%',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '用户名',
      width: '10%',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户权限',
      dataIndex: 'admin',
      key: 'admin',
      width: '10%',
      // render: admin => admin ? '管理员' : '普通用户'
      onCell: (record) => ({
        style: { color: record.admin ? "red" : "green" }
      }),
      render: (admin) => admin ? <div>管理员</div> : <div>普通用户</div>,
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: 30,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: '15%',
      render: (text, record) =>
        <>
          {contextHolder}
          <Popconfirm
            title="删除用户"
            description="确定要删除该用户吗？"
            onConfirm={() => deleteUser(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button size='small'>删除用户</Button>
          </Popconfirm>
          <Button onClick={() => showOpera(record)} size='small'>编辑</Button>
        </>
    },
  ];




  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    async function fetchData() {
      try {
        const response = await fetch('/api/userManage');
        const data = await response.json();
        if (response.ok) {
          try {
            const dataWithKeys = data.map((item) => ({
              ...item,
              key: item.uid, // 使用更稳定的唯一标识作为key
            }));
            setData(dataWithKeys);
            // console.log(data);
          } catch (error) {
            console.error("Parsing error:", error);
            console.log("Received text:", jsonData);
          }
        } else {
          console.error("API call failed:", response.statusText);
        }
      } catch (error) {
        console.error("Fetching error:", error);
        setData({ error: "Failed to load data." }); // 设置错误信息，以便在页面上显示
      }
    }

    fetchData();
  }, [loginStatus, router]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          // x: 1500,
          y: 600,
        }}
        locale={{
          triggerDesc: '点击降序排列',
          triggerAsc: '点击升序排列',
          cancelSort: '点击取消排序'
        }}
      />
      <Drawer
        title={"编辑用户信息：" + selectedUserName}
        onClose={onCloseOpera}
        open={openOpera}
      >
        {/* API 获取数据表单 */}
        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
          {/* 用户输入表单 */}
          <Col span={30}>
            <Form.Item
              name="newPassword"
              label="密码"
              rules={[
                {
                  required: 'true',
                  message: '请输入新密码',
                },
              ]}
            >
              <Input placeholder="请输入新密码" />
            </Form.Item>
          </Col>
          <Col span={30}>
            {/* <Row span={50}> */}
            <Form.Item
              name="privilege"
              label="用户权限"
              rules={[
                {
                  required: 'true',
                }
              ]}
              initialValue={radioValue}

            >
              <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
                <Radio.Group onChange={onRadioChange} value={radioValue}>
                  <Radio value={true}>管理员</Radio>
                  <Radio value={false}>普通用户</Radio>
                </Radio.Group>
              </Flex>
            </Form.Item>
            {/* </Row> */}
          </Col>
          <Col span={30}>
            {/* <Form.Item
              name="newPassword_2"
              label="请再次输入新密码"
              rules={[
                {
                  required: 'true',
                  message: '两次输入密码不一致',
                  // pattern: '^([-]?[1-9][0-9]*|0)$'
                },
              ]}
            >
              <Input placeholder="请再次输入新密码" />
            </Form.Item> */}
            {/* <Row span={50}> */}
            <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
              <Button type="primary" htmlType="submit">保存并修改</Button>
            </Flex>
            {/* </Row> */}
          </Col>

        </Form>
      </Drawer>
    </>
  )
}

export default page
