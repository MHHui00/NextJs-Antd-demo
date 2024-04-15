'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Button, Flex, Menu, SubMenu } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useLoginStore } from '@/store/useLoginStore';




function RootLayout({ children }) {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const userName = useLoginStore(state => state.userName);
  const userId = useLoginStore(state => state.userId);

  const router = useRouter();

  const [data, setData] = useState([]);
  const [current, setCurrent] = useState('allFund');

  const [isClientReady, setIsClientReady] = useState(false); //1. 新增状态，解决服务端和客户端不一致

  
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if(e.key){
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
    },
    {
      label: (

        `${userName}`
      ),
      style:{float: 'right'},
      key: 'userInfo',
      children: [
        // {
        //   label: (
        //     // <Button>登出</Button>
        //     <div onClick={()=>{console.log("登出");}}>登出</div>
        //   ),
        //   key: 'setting:1',
        // },
        {
          label: (<div style={{marginRight: '50px'}}>登出</div>),
          onClick: handleLogout, // 使用 onClick 属性来触发登出逻辑
        },
      ]
    },
  ];
  
  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    setIsClientReady(true); // 2.当客户端准备好后，设置为true
  }, [loginStatus, router]);


  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} justify='space-evenly' /> */}
          {/* {typeof window !== 'undefined' && loginStatus && <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />} */}
          {isClientReady && loginStatus && <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}><SubMenu style={{float: 'right'}}><Menu.Item key="setting:1">Option 1</Menu.Item></SubMenu></Menu>}
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;