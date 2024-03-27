'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Button, Flex, Menu } from 'antd';
import { useState } from 'react';
import { useRouter, redirect } from 'next/navigation'
import { useLoginStore } from '@/store/useLoginStore';




function RootLayout({ children }) {
  const userName = useLoginStore(state => state.username);
  const loginStatus = useLoginStore(state => state.loginStatus);
  const [current, setCurrent] = useState('allFund');
  const router = useRouter()
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

  // if(!loginStatus){
  //   redirect('/login');
  // }else{
  // }

  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          {/* <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} justify='space-evenly' /> */}
          {/* {loginStatus?children:redirect('/login')}  */}
          {loginStatus && <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} justify='space-evenly' />}
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;