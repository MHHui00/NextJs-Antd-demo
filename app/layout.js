'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Button, Flex, Menu } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useLoginStore } from '@/store/useLoginStore';




function RootLayout({ children }) {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const userName = useLoginStore(state => state.userName);

  const router = useRouter();

  const [data, setData] = useState([]);
  const [current, setCurrent] = useState('allFund');

  const [isClientReady, setIsClientReady] = useState(false); //1. 新增状态，解决服务端和客户端不一致

  
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    router.push(`/${e.key}`)
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
      key: 'userInfo',
      children: [
        {
          label: (
            <a>
              Na
            </a>
          ),
          key: 'setting:1',
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
          {isClientReady && loginStatus && <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />}
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;