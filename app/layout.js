'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Flex, Menu, Layout, Dropdown, Space, Button, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useLoginStore } from '@/store/useLoginStore';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;




function RootLayout({ children }) {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const userName = useLoginStore(state => state.userName);
  const userId = useLoginStore(state => state.userId);
  // const userId = useLoginStore(state => state.userId);

  const router = useRouter();

  const [data, setData] = useState([]);
  const [current, setCurrent] = useState('allFund');

  const [isClientReady, setIsClientReady] = useState(false); //1. 新增状态，解决服务端和客户端不一致

  const menu = (
    <Menu items={[
      {
        key: '1',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            1st menu item
          </a>
        ),
      },
    ]}
    />
  );

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key) {
      router.push(`/${e.key}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // 清空 localStorage
    // 这里假设 useLoginStore 有一个方法来更新登录状态
    useLoginStore.setState({ loginStatus: false, userName: '', userId: -1 });
    router.push('/login'); // 重定向到登录页面
  };


  const items = [
    {
      label: '所有基金',
      key: 'allFund',
    },
    {
      label: '自选基金',
      key: 'myFund',
      // disabled: true,
    },
    {
      label: '基金账本',
      key: 'myBill',
    },
    {
      label: '用戶管理',
      key: 'userManage',
      // disabled: true,
    },
    // {
    //   label: (

    //     `${userName}`
    //   ),
    //   style: { float: 'right' },
    //   key: 'userInfo',
    //   children: [
    //     // {
    //     //   label: (
    //     //     // <Button>登出</Button>
    //     //     <div onClick={()=>{console.log("登出");}}>登出</div>
    //     //   ),
    //     //   key: 'setting:1',
    //     // },
    //     {
    //       label: (<div style={{ marginRight: '50px' }}>登出</div>),
    //       onClick: handleLogout, // 使用 onClick 属性来触发登出逻辑
    //     },
    //   ]
    // },
  ];

  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    setIsClientReady(true); // 2.当客户端准备好后，设置为true
  }, [loginStatus, router]);


  return (
    <>
      <html lang="zh-CN">
        <body style={{ padding: 0, margin: 0 }}>
          <Layout style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'rgb(238,246, 256)' }}>
            <AntdRegistry>
              <Header
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between', // 这将确保子元素分布在头部的两端
                  backgroundColor: 'white',
                }}
              >
                {/* <div className="demo-logo" style={{ width: '20px', height: '20px', backgroundColor: 'skyblue' }}></div> */}
                <h2>基金管理系统</h2>
                {isClientReady && loginStatus && <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} theme='light'></Menu>}
                {isClientReady && loginStatus &&
                  <div className="demo-logo"
                    style={{
                      // width: '20px', 
                      // height: '20px', 
                      // backgroundColor: 'red',
                      display: 'flex',
                      alignItems: 'center', // 垂直居中
                    }}>
                    {'你好，' + userName}
                    <UserOutlined
                      style={{
                        fontSize: '1.5em',
                        marginLeft: '5px'
                      }} />
                    <Button onClick={() => handleLogout()} size='small'>登出</Button>
                  </div>
                }
              </Header>
              <Content
                style={{
                  padding: '10px 10px 10px 10px',
                  // backgroundColor: 'rgb(238,246, 256)',
                  flex: 1,
                  // overflow: 'auto',  // 添加滚动条
                  height: '900px',
                }}
              >
                {children}
              </Content>
              <Footer
                style={{
                  textAlign: 'center',
                  paddingTop: '0px',
                  backgroundColor: 'rgb(238,246, 256)'
                  // paddingBottom: '20px',
                  // backgroundColor: 'white',
                }}
              >
                <Divider/>
                基金管理系统 ©{new Date().getFullYear()} Created by 2020055585
              </Footer>
            </AntdRegistry>
          </Layout>
        </body>
      </html>
    </>
  );
}

export default RootLayout;