'use client'
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Button, Flex, Menu } from 'antd';
import { useState } from 'react';

const items = [
  {
    label: 'Navigation One',
    key: 'mail',
  },
  {
    label: 'Navigation Two',
    key: 'app',
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
    key: 'alipay',
  },
];

function RootLayout ({ children }){
   const [current, setCurrent] = useState('mail');
   const onClick = (e) => {
     console.log('click ', e);
     setCurrent(e.key);
   };

  return (
    <html lang="en">
    <body>
      <AntdRegistry>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} justify='space-evenly' />
        {children}
      </AntdRegistry>
    </body>
  </html>
);
}

export default RootLayout;