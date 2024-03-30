'use client'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLoginStore } from '@/store/useLoginStore';
import { redirect, useRouter } from 'next/navigation'



// const dataTemp = [];
// for (let i = 0; i < 10; i++) {
//   dataTemp.push({
//     key: i,
//     uid: `0${i}`,
//     username: `0${i}${i}${i}`,
//     password: `0${i+1}${i+1}${i+1}`,
//   });
// }
// const data2 = [
//   { uid: 1, username: 'qwe', password: 'password' },
//   { uid: 2, username: 'ken', password: 'password' },
//   { uid: 3, username: 'ben', password: 'password' },
//   { uid: 4, username: 'jan', password: 'password' }
// ]

const page = () => {

  const columns = [
    {
      title: '基金代码',
      width: 20,
      dataIndex: 'uid',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'week1',
      width: 20,
      dataIndex: 'username',
      key: 'age',
      // fixed: 'left',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.w01 - b.w01,
    },
    {
      title: 'week2',
      dataIndex: 'password',
      key: '1',
      width: 30,
      sorter: (a, b) => a.w02 - b.w02,
    },

    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 30,
      render: () => <a>Action</a>,
    },
  ];

  const loginStatus = useLoginStore(state => state.loginStatus);
  const router = useRouter();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    async function fetchData() {
      try {
        // const response = await fetch('http://localhost:3001/api/test');
        const response = await fetch('/api/test');
        if (response.ok) {
          const jsonData = await response.text(); // 先获取文本内容
          try {
            const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
            // console.log(obj);
            setData(obj);
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
    <Table
      columns={columns}
      dataSource={data}
      scroll={{
        x: 1500,
        y: 600,
      }}
      locale={{
        triggerDesc: '点击降序排列',
        triggerAsc: '点击升序排列',
        cancelSort: '点击取消排序'
      }}
    />
  )
}

export default page
