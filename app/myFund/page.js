"use client";
import { Table, Button, message, Popconfirm, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState, useRef } from 'react'
import { useLoginStore } from '@/store/useLoginStore';
import { redirect, useRouter } from 'next/navigation'

const page = () => {

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
          placeholder={`输入 ${dataIndex} 来搜索`}
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
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
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
      width: 100,
      dataIndex: 'fid',
      key: 'id',
      fixed: 'left',
      sorter: (a, b) => a.fid - b.fid,
      ...getColumnSearchProps('fid'),
    },
    {
      title: '基金名称',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      ...getColumnSearchProps('name'),

    },
    {
      title: '实时净值',
      width: 100,
      dataIndex: 'Value',
      key: 'value',

    },
    {
      title: '实时涨幅',
      width: 100,
      dataIndex: 'Rate',
      key: 'rate',
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近1周',
      width: 100,
      dataIndex: 'w01',
      key: 'w01',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.w01 - b.w01,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近2周',
      dataIndex: 'w02',
      key: '1',
      width: 75,
      sorter: (a, b) => a.w02 - b.w02,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近3周',
      dataIndex: 'w03',
      key: '2',
      width: 75,
      sorter: (a, b) => a.w03 - b.w03,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近4周',
      dataIndex: 'w04',
      key: '3',
      width: 75,
      sorter: (a, b) => a.w04 - b.w04,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },

    },
    {
      title: '近5周',
      dataIndex: 'w05',
      key: '4',
      width: 75,
      sorter: (a, b) => a.w05 - b.w05,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近6周',
      dataIndex: 'w06',
      key: '5',
      width: 75,
      sorter: (a, b) => a.w06 - b.w06,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近7周',
      dataIndex: 'w07',
      key: '6',
      width: 75,
      sorter: (a, b) => a.w07 - b.w07,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近8周',
      dataIndex: 'w08',
      key: '7',
      width: 75,
      sorter: (a, b) => a.w08 - b.w08,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近1月',
      dataIndex: 'M01',
      key: '8',
      width: 75,
      sorter: (a, b) => a.M01 - b.M01,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近2月',
      dataIndex: 'M02',
      key: '9',
      width: 75,
      sorter: (a, b) => a.M02 - b.M02,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近1天',
      dataIndex: 'R02',
      key: '10',
      width: 75,
      sorter: (a, b) => a.R01 - b.R01,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近2天',
      dataIndex: 'R02',
      key: '11',
      width: 75,
      sorter: (a, b) => a.R02 - b.R02,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近3天',
      dataIndex: 'R03',
      key: '12',
      width: 75,
      sorter: (a, b) => a.R03 - b.R03,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近4天',
      dataIndex: 'R04',
      key: '13',
      width: 75,
      sorter: (a, b) => a.R04 - b.R04,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近5天',
      dataIndex: 'R05',
      key: '14',
      width: 75,
      sorter: (a, b) => a.R05 - b.R05,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近6天',
      dataIndex: 'R06',
      key: '15',
      width: 75,
      sorter: (a, b) => a.R06 - b.R06,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近7天',
      dataIndex: 'R07',
      key: '16',
      width: 75,
      sorter: (a, b) => a.R07 - b.R07,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近8天',
      dataIndex: 'R08',
      key: '17',
      width: 75,
      sorter: (a, b) => a.R08 - b.R08,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近9天',
      dataIndex: 'R09',
      key: '18',
      width: 75,
      sorter: (a, b) => a.R09 - b.R09,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近10天',
      dataIndex: 'R10',
      key: '19',
      width: 75,
      sorter: (a, b) => a.R10 - b.R10,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近11天',
      dataIndex: 'R11',
      key: '20',
      width: 75,
      sorter: (a, b) => a.R11 - b.R11,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近12天',
      dataIndex: 'R12',
      key: '21',
      width: 75,
      sorter: (a, b) => a.R12 - b.R12,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近13天',
      dataIndex: 'R13',
      key: '22',
      width: 75,
      sorter: (a, b) => a.R13 - b.R13,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近14天',
      dataIndex: 'R14',
      key: '23',
      width: 75,
      sorter: (a, b) => a.R14 - b.R14,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近15天',
      dataIndex: 'R15',
      key: '24',
      width: 75,
      sorter: (a, b) => a.R15 - b.R15,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近16天',
      dataIndex: 'R16',
      key: '25',
      width: 75,
      sorter: (a, b) => a.R16 - b.R16,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近17天',
      dataIndex: 'R17',
      key: '26',
      width: 75,
      sorter: (a, b) => a.R17 - b.R17,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近18天',
      dataIndex: 'R18',
      key: '27',
      width: 75,
      sorter: (a, b) => a.R18 - b.R18,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近19天',
      dataIndex: 'R19',
      key: '28',
      width: 75,
      sorter: (a, b) => a.R19 - b.R19,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近20天',
      dataIndex: 'R20',
      key: '29',
      width: 75,
      sorter: (a, b) => a.R20 - b.R20,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近21天',
      dataIndex: 'R21',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R21 - b.R21,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近22天',
      dataIndex: 'R22',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R22 - b.R22,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近23天',
      dataIndex: 'R23',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R23 - b.R23,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近24天',
      dataIndex: 'R24',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R24 - b.R24,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近25天',
      dataIndex: 'R26',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R25 - b.R25,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近26天',
      dataIndex: 'R26',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R26 - b.R26,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近27天',
      dataIndex: 'R27',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R27 - b.R27,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近28天',
      dataIndex: 'R28',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R28 - b.R28,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近29天',
      dataIndex: 'R29',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R29 - b.R29,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: '近30天',
      dataIndex: 'R30',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R30 - b.R30,
      render(text, record) {
        return {
          props: {
            style: { color: parseFloat(text) > 0 ? "red" : "green" }
          },
          children: <div>{text}</div>
        };
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 90,
      render: (text, record) =>
        <>
          {contextHolder}
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => addToMyFund(record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button onClick={error} size='small'>买入</Button>
            <Button onClick={error} size='small'>删除自选</Button>
          </Popconfirm>
          <Button onClick={error} size='small'>查看图表</Button>
        </>
    }
  ];

  //全局提示
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };

  // 加入自选
  const addToMyFund = (record) => {
    console.log(record.fid);
    // message.success('Click on Yes');
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };
  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };


  //
  const loginStatus = useLoginStore(state => state.loginStatus);
  const router = useRouter();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    async function fetchData() {
      try {
        const response = await fetch('/api/myFund');
        if (response.ok) {
          const jsonData = await response.text(); // 先获取文本内容
          try {
            const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
            // console.log(obj);
            setData(obj);
          } catch (error) {
            console.error("Parsing error:", error);
            // console.log("Received text:", jsonData);
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

export default page
