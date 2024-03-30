"use client";
import { Table, Button, message, Popconfirm, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState, useRef } from 'react'
import { useLoginStore } from '@/store/useLoginStore';
import { useRouter } from 'next/navigation';


function Home() {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const userId = useLoginStore(state => state.userId);

  const router = useRouter()
  const [data, setData] = useState([]);

  //搜索Start
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`输入 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            搜索
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            关闭
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  //搜索End
  
  const columns = [
    {
      title: '基金代码',
      width: '10%',
      dataIndex: 'fid',
      key: 'name',
      fixed: 'left',
      sorter: (a, b) => a.fid - b.fid,
      ...getColumnSearchProps('fid'),
    },
    {
      title: '基金名称',
      width: '15%',
      dataIndex: 'name',
      key: 'age',
      fixed: 'left',
      ...getColumnSearchProps('name'),
    },
    {
      title: '实时涨幅',
      dataIndex: 'rate',
      key: '1',
      width: 50,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.rate - b.rate,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      }
    },
    {
      title: '实时净值',
      dataIndex: 'value',
      key: '2',
      width: 50,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: '基金类型',
      dataIndex: 'leixin',
      key: '3',
      width: 50,
    },
    {
      title: '拼音代码',
      dataIndex: 'pinyin',
      key: '4',
      width: 80,
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
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={()=>addToMyFund(record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size='small'>加入自选</Button>
          </Popconfirm>
          <Button onClick={error} size='small'>查看图表</Button>
          <Button onClick={error} size='small'>买入</Button>
        </>
    },
  ];

  //全局提示
  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };

  // 加入自选
  const addToMyFund = async (record) => {
    try {
      const response = await fetch(`/api/addToMyFund?fid=${record.fid}&userId=${userId}&fundName=${record.name}`, {
        method: 'POST', // 确保使用正确的 HTTP 方法
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        // alert(data.message); // 或者使用更友好的用户通知方式
        messageApi.open({
          type: 'success',
          content: data.message,
        });
      } else {
        // 处理错误情况，例如基金已存在于列表中
        // alert(data.message); // 根据 API 返回的消息显示提示
        messageApi.open({
          type: 'eorror',
          content: data.message,
        });
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      alert('Failed to add to favorites. Please try again.'); // 显示一个错误消息
    }
  };


  




  
  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/allFund');
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

  // if(loginStatus === false){
  //   console.log("login first");
  //   redirect('/login');
  // }else{
  // }
  return (
    <>
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
    </>
  );
}

export default Home;  