'use client'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

const columns = [
  {
    title: '基金代码',
    width: 20,
    dataIndex: 'fid',
    key: 'name',
    // fixed: 'left',
  },
  {
    title: 'week1',
    width: 20,
    dataIndex: 'w01',
    key: 'age',
    // fixed: 'left',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.w01 - b.w01,
  },
  {
    title: 'week2',
    dataIndex: 'w02',
    key: '1',
    width: 30,
    sorter: (a, b) => a.w02 - b.w02,
  },
  {
    title: 'week3',
    dataIndex: 'w03',
    key: '2',
    width: 30,
    sorter: (a, b) => a.w03 - b.w03,
  },
  {
    title: 'Action',
    key: 'operation',
    // fixed: 'right',
    width: 30,
    render: () => <a>Action</a>,
  },
];

const dataTemp = [];
for (let i = 0; i < 10; i++) {
  dataTemp.push({
    key: i,
    fid: `0${i}`,
    w01: `0${i}${i}${i}`,
    w02: `0${i+1}${i+1}${i+1}`,
    w03: `0${i+2}${i+2}${i+2}`,
  });
}

const page = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
        try {
            // const response = await fetch('https://jsonplaceholder.org/users');
            const response = await fetch('http://localhost:3000/api/test');
            if (response.ok) {
                const jsonData = await response.text(); // 先获取文本内容
                try {
                    const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
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
}, []);

  return (
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1500,
          y: 600,
        }}
      />
  )
}

export default page
