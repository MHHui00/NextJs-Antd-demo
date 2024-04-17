"use client";
import { Table, Button, message, Popconfirm, Input, Space, Drawer, Form, Col, Row, Flex, Image, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useEffect, useState, useRef } from 'react'
import { useLoginStore } from '@/store/useLoginStore';
import { redirect, useRouter } from 'next/navigation'

const boxStyle = {
  width: '100%',
  // height: 120,
  borderRadius: 6,
  // border: '1px solid #40a9ff',
};

const page = () => {
  const loginStatus = useLoginStore(state => state.loginStatus);
  const userId = useLoginStore(state => state.userId);
  const router = useRouter();
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

  //抽屉-图表
  const [openChart, setOpenChart] = useState(false);
  const [selectedFund, setSelectedFund] = useState('')// 传递点击的基金 
  const [selectedFundId, setSelectedFundId] = useState(0)// 传递点击的基金

  //买入基金
  // Set default values
  const [givenCost, setGivenCost] = useState(10.0); // 默认当前成本
  const [givenNum, setGivenNum] = useState(1.0); // 默认当前持仓
  // Form instance for controlling and accessing form values
  const [form] = Form.useForm();


  const showChart = (record) => {
    setSelectedFund(record.name)
    setSelectedFundId(record.fid.toString().padStart(6, '0'))
    setOpenChart(true);
  };
  const onCloseChart = () => {
    setOpenChart(false);
  };

  //抽屉-买入
  const [openOpera, setOpenOpera] = useState(false);
  const showOpera = async (record) => {
    //清空之前的input
    form.setFieldsValue({
      newCost: '',      //清空
      newNum: '',
      cost: '',
      num: '',
    });

    // 开启买入抽屉获取该基金的position
    try {
      const response = await fetch(`/api/getFundPosition?fid=${record.fid}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setGivenCost(data.record.yuanjia);
        setGivenNum(data.record.fenshu);
        form.setFieldsValue({
          givenCost: data.record.yuanjia,
          givenNum: data.record.fenshu,
          // givenCost: givenCost,
          // givenNum: givenNum,
        });
        // console.log('seted setGivenCost and setGivenNum');
      } else if (response.status === 500) {
        // Handle the case where no records are found in the database
        setGivenCost(0);
        setGivenNum(0);
        form.setFieldsValue({
          givenCost: 0,
          givenNum: 0,
        });
        console.log('No records found, keeping default values.');
      }
    } catch (error) {
      console.error('Failed to fetch fund details:', error);
    }

    setSelectedFund(record.name)
    setSelectedFundId(record.fid.toString().padStart(6, '0'))
    setOpenOpera(true);
  };
  const onCloseOpera = () => {
    setOpenOpera(false);
  };

  //买入基金逻辑：
  //买入表单提交
  const onFinish = async (values) => {
    //直接提交，则(不管是否有预览结果都重新计算)计算newNum和newCost再返回values
    // console.log('Got values:', values);
    const newNum = Number(givenNum) + Number(values.num); // 最终持仓数
    const newCost = ((givenCost * givenNum) + (values.cost * values.num)) / newNum; // 最终成本价
    values.newNum = newNum;
    values.newCost = newCost;
    // console.log('calculated values:', values);
    //提交修改
    try {
      const response = await fetch(`/api/positionChange?fid=${selectedFundId}&userId=${userId}&newNum=${values.newNum}&newCost=${values.newCost}`, {
        method: 'POST', // 确保使用正确的 HTTP 方法
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        messageApi.open({
          type: 'success',
          content: data.message,
        });
      } else {
        messageApi.open({
          type: 'eorror',
          content: data.message,
        });
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      // alert('Failed to add to favorites. Please try again.'); // 显示一个错误消息
    }

  };
  //预览结果
  // Logic for calculating and setting the final holdings and final cost price
  const handlePreviewResult = () => {
    form.validateFields(['cost', 'num']).then((values) => {
      const { cost, num } = values;
      const newNum = Number(givenNum) + Number(num); // 最终持仓数
      const newCost = ((givenCost * givenNum) + (cost * num)) / newNum; // 最终成本价

      // Update form fields with calculated values
      form.setFieldsValue({
        newCost: newCost.toFixed(2),
        newNum: newNum.toFixed(2),
      });
    }).catch((info) => {
      console.log('Validate Failed:', info);
      // message.error('请先输入买入数量和买入价格！');
    });
  };

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
    // {
    //   title: '实时涨幅',
    //   width: 100,
    //   dataIndex: 'Rate',
    //   key: 'rate',
    //   render(text, record) {
    //     return {
    //       props: {
    //         style: { color: parseFloat(text) > 0 ? "red" : "green" }
    //       },
    //       children: <div>{text}</div>
    //     };
    //   },
    // },
    {
      title: '实时涨幅',
      width: 100,
      dataIndex: 'Rate',
      key: 'rate',
      onCell: (record) => ({
        style: { color: parseFloat(record.Rate) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近1周',
      width: 100,
      dataIndex: 'w01',
      key: 'w01',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.w01 - b.w01,
      onCell: (record) => ({
        style: { color: parseFloat(record.w01) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近2周',
      dataIndex: 'w02',
      key: '1',
      width: 75,
      sorter: (a, b) => a.w02 - b.w02,
      onCell: (record) => ({
        style: { color: parseFloat(record.w02) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近3周',
      dataIndex: 'w03',
      key: '2',
      width: 75,
      sorter: (a, b) => a.w03 - b.w03,
      onCell: (record) => ({
        style: { color: parseFloat(record.w03) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近4周',
      dataIndex: 'w04',
      key: '3',
      width: 75,
      sorter: (a, b) => a.w04 - b.w04,
      onCell: (record) => ({
        style: { color: parseFloat(record.w04) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,

    },
    {
      title: '近5周',
      dataIndex: 'w05',
      key: '4',
      width: 75,
      sorter: (a, b) => a.w05 - b.w05,
      onCell: (record) => ({
        style: { color: parseFloat(record.w05) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近6周',
      dataIndex: 'w06',
      key: '5',
      width: 75,
      sorter: (a, b) => a.w06 - b.w06,
      onCell: (record) => ({
        style: { color: parseFloat(record.w06) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近7周',
      dataIndex: 'w07',
      key: '6',
      width: 75,
      sorter: (a, b) => a.w07 - b.w07,
      onCell: (record) => ({
        style: { color: parseFloat(record.w07) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近8周',
      dataIndex: 'w08',
      key: '7',
      width: 75,
      sorter: (a, b) => a.w08 - b.w08,
      onCell: (record) => ({
        style: { color: parseFloat(record.w08) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近1月',
      dataIndex: 'M01',
      key: '8',
      width: 75,
      sorter: (a, b) => a.M01 - b.M01,
      onCell: (record) => ({
        style: { color: parseFloat(record.M01) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近2月',
      dataIndex: 'M02',
      key: '9',
      width: 75,
      sorter: (a, b) => a.M02 - b.M02,
      onCell: (record) => ({
        style: { color: parseFloat(record.M02) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近1天',
      dataIndex: 'R01',
      key: '10',
      width: 75,
      sorter: (a, b) => a.R01 - b.R01,
      onCell: (record) => ({
        style: { color: parseFloat(record.R02) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近2天',
      dataIndex: 'R02',
      key: '11',
      width: 75,
      sorter: (a, b) => a.R02 - b.R02,
      onCell: (record) => ({
        style: { color: parseFloat(record.R02) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近3天',
      dataIndex: 'R03',
      key: '12',
      width: 75,
      sorter: (a, b) => a.R03 - b.R03,
      onCell: (record) => ({
        style: { color: parseFloat(record.R03) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近4天',
      dataIndex: 'R04',
      key: '13',
      width: 75,
      sorter: (a, b) => a.R04 - b.R04,
      onCell: (record) => ({
        style: { color: parseFloat(record.R04) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近5天',
      dataIndex: 'R05',
      key: '14',
      width: 75,
      sorter: (a, b) => a.R05 - b.R05,
      onCell: (record) => ({
        style: { color: parseFloat(record.R05) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近6天',
      dataIndex: 'R06',
      key: '15',
      width: 75,
      sorter: (a, b) => a.R06 - b.R06,
      onCell: (record) => ({
        style: { color: parseFloat(record.R06) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近7天',
      dataIndex: 'R07',
      key: '16',
      width: 75,
      sorter: (a, b) => a.R07 - b.R07,
      onCell: (record) => ({
        style: { color: parseFloat(record.R07) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近8天',
      dataIndex: 'R08',
      key: '17',
      width: 75,
      sorter: (a, b) => a.R08 - b.R08,
      onCell: (record) => ({
        style: { color: parseFloat(record.R08) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近9天',
      dataIndex: 'R09',
      key: '18',
      width: 75,
      sorter: (a, b) => a.R09 - b.R09,
      onCell: (record) => ({
        style: { color: parseFloat(record.R09) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近10天',
      dataIndex: 'R10',
      key: '19',
      width: 75,
      sorter: (a, b) => a.R10 - b.R10,
      onCell: (record) => ({
        style: { color: parseFloat(record.R10) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近11天',
      dataIndex: 'R11',
      key: '20',
      width: 75,
      sorter: (a, b) => a.R11 - b.R11,
      onCell: (record) => ({
        style: { color: parseFloat(record.R11) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近12天',
      dataIndex: 'R12',
      key: '21',
      width: 75,
      sorter: (a, b) => a.R12 - b.R12,
      onCell: (record) => ({
        style: { color: parseFloat(record.R12) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近13天',
      dataIndex: 'R13',
      key: '22',
      width: 75,
      sorter: (a, b) => a.R13 - b.R13,
      onCell: (record) => ({
        style: { color: parseFloat(record.R13) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近14天',
      dataIndex: 'R14',
      key: '23',
      width: 75,
      sorter: (a, b) => a.R14 - b.R14,
      onCell: (record) => ({
        style: { color: parseFloat(record.R14) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近15天',
      dataIndex: 'R15',
      key: '24',
      width: 75,
      sorter: (a, b) => a.R15 - b.R15,
      onCell: (record) => ({
        style: { color: parseFloat(record.R15) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近16天',
      dataIndex: 'R16',
      key: '25',
      width: 75,
      sorter: (a, b) => a.R16 - b.R16,
      onCell: (record) => ({
        style: { color: parseFloat(record.R16) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近17天',
      dataIndex: 'R17',
      key: '26',
      width: 75,
      sorter: (a, b) => a.R17 - b.R17,
      onCell: (record) => ({
        style: { color: parseFloat(record.R17) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近18天',
      dataIndex: 'R18',
      key: '27',
      width: 75,
      sorter: (a, b) => a.R18 - b.R18,
      onCell: (record) => ({
        style: { color: parseFloat(record.R18) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近19天',
      dataIndex: 'R19',
      key: '28',
      width: 75,
      sorter: (a, b) => a.R19 - b.R19,
      onCell: (record) => ({
        style: { color: parseFloat(record.R19) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近20天',
      dataIndex: 'R20',
      key: '29',
      width: 75,
      sorter: (a, b) => a.R20 - b.R20,
      onCell: (record) => ({
        style: { color: parseFloat(record.R20) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近21天',
      dataIndex: 'R21',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R21 - b.R21,
      onCell: (record) => ({
        style: { color: parseFloat(record.R21) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近22天',
      dataIndex: 'R22',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R22 - b.R22,
      onCell: (record) => ({
        style: { color: parseFloat(record.R22) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近23天',
      dataIndex: 'R23',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R23 - b.R23,
      onCell: (record) => ({
        style: { color: parseFloat(record.R23) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近24天',
      dataIndex: 'R24',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R24 - b.R24,
      onCell: (record) => ({
        style: { color: parseFloat(record.R24) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近25天',
      dataIndex: 'R26',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R25 - b.R25,
      onCell: (record) => ({
        style: { color: parseFloat(record.R25) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近26天',
      dataIndex: 'R26',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R26 - b.R26,
      onCell: (record) => ({
        style: { color: parseFloat(record.R26) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近27天',
      dataIndex: 'R27',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R27 - b.R27,
      onCell: (record) => ({
        style: { color: parseFloat(record.R27) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近28天',
      dataIndex: 'R28',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R28 - b.R28,
      onCell: (record) => ({
        style: { color: parseFloat(record.R28) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近29天',
      dataIndex: 'R29',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R29 - b.R29,
      onCell: (record) => ({
        style: { color: parseFloat(record.R29) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '近30天',
      dataIndex: 'R30',
      key: '30',
      width: 75,
      sorter: (a, b) => a.R30 - b.R30,
      onCell: (record) => ({
        style: { color: parseFloat(record.R30) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
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
            onConfirm={() => deltetFromMyFund(record)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button size='small'>删除自选</Button>
          </Popconfirm>
          {/* <Button onClick={error} size='small'>买入</Button> */}
          <Button onClick={() => showChart(record)} size='small'>查看图表</Button>
          <Button onClick={() => showOpera(record)} size='small'>买入</Button>
          {/* <Button onClick={error} size='small'>查看图表</Button> */}
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
  const deltetFromMyFund = async (record) => {
    try {
      const response = await fetch(`/api/deleteFromMyFund?fid=${record.fid}&userId=${userId}`, {
        method: 'DELETE', // 确保使用正确的 HTTP 方法
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: data.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      } else {
        messageApi.open({
          type: 'eorror',
          content: data.message,
        });
      }
    } catch (error) {
      console.error('Failed to delete the fund:', error);
      alert('Failed to delete the fund. Please try again.'); // 显示一个错误消息
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };


  //


  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    async function fetchData() {
      try {
        const response = await fetch(`/api/myFund?userId=${userId}`);
        if (response.ok) {
          const jsonData = await response.text(); // 先获取文本内容
          try {
            const obj = JSON.parse(jsonData); // 尝试解析文本为JSON
            // console.log(obj);
            // setData(obj);
            const dataWithKeys = obj.map((item) => ({
              ...item,
              key: item.fid, // 使用更稳定的唯一标识作为key
            }));
            setData(dataWithKeys);
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
      <Drawer
        title={selectedFund}
        onClose={onCloseChart}
        open={openChart}
        size='large'
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <h2>单位净值走势图</h2>
          <Image
            width={700}
            src={`https://j3.dfcfw.com/images/JJJZ1/${selectedFundId}.png`}
            placeholder={
              <Image
                preview={false}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                width={700}
                height={245}
              />
            }
            fallback="data:image/png;base64,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"
          />
          <h2>持仓前十股票</h2>
          <Image
            width={700}
            src={`https://j6.dfcfw.com/charts/StockPos/${selectedFundId}.png?rt=NaN`}
            placeholder={
              <Image
                preview={false}
                src="data:image/png;base64,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"
                width={700}
                height={245}
              />
            }
            fallback="data:image/png;base64,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"
          />
        </Space>
      </Drawer>

      <Drawer
        title={selectedFund}
        onClose={onCloseOpera}
        open={openOpera}
      >
        {/* API 获取数据表单 */}
        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
          <Col span={30}>
            <Form.Item name="givenCost" label="当前成本" initialValue={givenCost}>
              <Input placeholder="当前成本" disabled={true} />
            </Form.Item>
          </Col>
          <Col span={30}>
            <Form.Item name="givenNum" label="当前持仓" initialValue={givenNum}>
              <Input placeholder="当前持仓" disabled={true} />
            </Form.Item>
          </Col>

          {/* 用户输入表单 */}
          <Col span={30}>
            <Form.Item
              name="cost"
              label="买入 价格"
              rules={[
                {
                  required: 'ture',
                  message: '请输入正确的价格',
                  pattern: '^([-]?[1-9][0-9]*|0)$'
                },
              ]}
            >
              <Input placeholder="请输入买入价格：" />
            </Form.Item>
          </Col>
          <Col span={30}>

            <Form.Item
              name="num"
              label="买入 数量"
              rules={[
                {
                  required: 'true',
                  message: '请输入正确的数量',
                  pattern: '^([-]?[1-9][0-9]*|0)$'
                },
              ]}
            >
              <Input placeholder="请输入买入数量：" />
            </Form.Item>
            <Row span={50}>
              <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
                <Button type="primary" htmlType="submit">确认买入</Button>
                <Button onClick={handlePreviewResult}>预览结果</Button>
              </Flex>
            </Row>
          </Col>
          <Divider />

          {/* 前端计算预览结果表单 */}
          <Col span={30}>
            <Form.Item
              name="newCost"
              label="最终成本价"
              disable="ture"
            // initialValue={0}
            >
              <Input placeholder="最终成本价" disabled={true} />
            </Form.Item>
          </Col>
          <Col span={30}>
            <Form.Item
              name="newNum"
              label="最终持仓数"
            // initialValue={0}
            >
              <Input placeholder="最终持仓数" disabled={true} />
            </Form.Item>
          </Col>
        </Form>
      </Drawer>
    </>
  );
}

export default page
