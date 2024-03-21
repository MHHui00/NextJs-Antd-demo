'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Button, Flex, Menu } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

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
      // <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
      //   Navigation Four - Link
      // </a>
      '用户'
    ),
    key: 'userInfo',
  },
];

function RootLayout ({ children }){
   const [current, setCurrent] = useState('allFund');
   const router = useRouter()
   const onClick = (e) => {
     console.log('click ', e);
     setCurrent(e.key);
     router.push(`/${e.key}`)
   };

  return (
    <html lang="zh-CN">
    <body>
      <AntdRegistry>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} justify='space-evenly'/>
        {children}
      </AntdRegistry>
    </body>
  </html>
);
}

export default RootLayout;