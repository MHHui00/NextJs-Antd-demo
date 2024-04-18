'use client'
import { Table, Button, message, Popconfirm, Input, Space, Drawer, Row, Form, Col, Image, Divider, Flex } from 'antd';
import React, { useEffect, useState } from 'react'
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

  const [messageApi, contextHolder] = message.useMessage();

  //抽屉-图表
  const [openChart, setOpenChart] = useState(false);
  const [selectedFund, setSelectedFund] = useState('')// 传递点击的基金 
  const [selectedFundId, setSelectedFundId] = useState(0)// 传递点击的基金ID

  //买入基金
  // Set default values
  const [givenCost, setGivenCost] = useState(10.0); // 默认当前成本
  const [givenNum, setGivenNum] = useState(1.0); // 默认当前持仓
  // Form instance for controlling and accessing form values
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState("")


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
  const showOpera = async (record, type) => {
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
        setSelectedFund(record.name)
        setSelectedFundId(record.fid.toString().padStart(6, '0'))
        setTransactionType(type)  //记录交易类型
        setOpenOpera(true);
      } else if (response.status === 500 && type === "buy") {
        // Handle the case where no records are found in the database
        setGivenCost(0);
        setGivenNum(0);
        form.setFieldsValue({
          givenCost: 0,
          givenNum: 0,
        });
        setSelectedFund(record.name)
        setSelectedFundId(record.fid.toString().padStart(6, '0'))
        setTransactionType(type)  //记录交易类型
        setOpenOpera(true);
        console.log('No records found, keeping default values.');
      } else if (response.status === 500 && type === "sell") {  //没有持仓是，不能打开卖出界面
        console.log('No buy record found, cant sell.');
        messageApi.open({
          type: 'error',
          content: "您没有该基金的持仓记录，无法卖出",
        });
      }
    } catch (error) {
      console.error('Failed to fetch fund details:', error);
    }


  };
  const onCloseOpera = () => {
    setOpenOpera(false);
  };

  //买入基金逻辑：
  //买入表单提交
  const onFinish = async (values) => {
    //如果不按预览直接提交交易，也必须调用预览按钮的函数，把计算结果覆盖收集回来的form value
    handlePreviewResult();
    values.newNum = form.getFieldValue('newNum');
    values.newCost = form.getFieldValue('newCost');
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
        onCloseOpera();
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      } else {
        messageApi.open({
          type: 'error',
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
    if (transactionType === 'buy') {
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
    }
    if (transactionType === 'sell') {
      form.validateFields(['cost', 'num']).then((values) => {
        const { cost, num } = values;
        const newNum = Number(givenNum) - Number(num); // 最终持仓数
        const newCost = ((givenCost * givenNum) - (cost * num)) / newNum; // 最终成本价

        if (newNum >= 0) {      //做基本的检查
          // Update form fields with calculated values
          form.setFieldsValue({
            newCost: newCost.toFixed(2),
            newNum: newNum.toFixed(2),
          });
        } else {
          messageApi.open({
            type: 'error',
            content: "卖出份数超出最大值",
          });
        }
      }).catch((info) => {
        console.log('Validate Failed:', info);
        // message.error('请先输入买入数量和买入价格！');
      });
    }
    console.log(form);
  };

  const columns = [
    {
      title: '基金代码',
      width: '6%',
      dataIndex: 'fid',
      key: 'name',
      fixed: 'left',
      sorter: (a, b) => a.fid - b.fid,
    },
    {
      title: '基金名称',
      width: '14%',
      dataIndex: 'name',
      key: 'age',
      fixed: 'left',
    },
    {
      title: '预估涨幅',
      dataIndex: 'guzhi',
      key: 'guzhi',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.guzhi - b.guzhi,
      onCell: (record) => ({
        style: { color: parseFloat(record.guzhi) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '预估净值',
      dataIndex: 'gujia',
      key: 'gujia',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.gujia - b.gujia,
    },
    {
      title: '预估盈亏',
      dataIndex: 'gushouyi',
      key: 'gushouyi',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.gushouyi - b.gushouyi,
      onCell: (record) => ({
        style: { color: parseFloat(record.gushouyi) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '实际涨幅',
      dataIndex: 'newzhi',
      key: 'newzhi',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.newzhi - b.newzhi,
      onCell: (record) => ({
        style: { color: parseFloat(record.newzhi) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '实际净值',
      dataIndex: 'newjia',
      key: 'newjia',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.newjia - b.newjia,
    },
    {
      title: '实际盈亏',
      dataIndex: 'newshouyi',
      key: 'newshouyi',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.newshouyi - b.newshouyi,
      onCell: (record) => ({
        style: { color: parseFloat(record.newshouyi) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '持有份数',
      dataIndex: 'fenshu',
      key: 'fenshu',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.fenshu - b.fenshu,
    },
    {
      title: '成本净值',
      dataIndex: 'yuanjia',
      key: 'yuanjia',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.yuanjia - b.yuanjia,
    },
    {
      title: '成本金额',
      dataIndex: 'yuanzhi',
      key: 'yuanzhi',
      width: 31,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.yuanzhi - b.yuanzhi,
    },
    {
      title: '昨日净值',
      dataIndex: 'xianjia',
      key: 'xianjia',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.xianjia - b.xianjia,
    },
    {
      title: '昨日金额',
      dataIndex: 'xianzhi',
      key: 'xianzhi',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.xianzhi - b.xianzhi,
    },
    {
      title: '盈亏',
      dataIndex: 'shouyi',
      key: 'shouyi',
      width: 31,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.shouyi - b.shouyi,
      onCell: (record) => ({
        style: { color: parseFloat(record.shouyi) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '盈亏率',
      dataIndex: 'shouyilv',
      key: 'shoyilv',
      width: 30,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.shoyilv - b.shoyilv,
      onCell: (record) => ({
        style: { color: parseFloat(record.shoyilv) > 0 ? "red" : "green" }
      }),
      render: (text) => <div>{text}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '7%',
      render: (text, record) =>
        <>
          {contextHolder}
          <Button onClick={() => showChart(record)} size='small'>查看图表</Button>
          <Popconfirm
            title="交易"
            description="选择交易类型"
            onConfirm={() => showOpera(record, "buy")}
            onCancel={() => showOpera(record, "sell")}
            okText="买入"
            cancelText="卖出"
          >
            <Button size='small'>交易</Button>
          </Popconfirm>
        </>
    },
  ];


  useEffect(() => {
    if (!loginStatus) {
      router.push('/login');
    }
    async function fetchData() {
      try {
        const response = await fetch(`/api/myBill?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          try {
            const dataWithKeys = data.map((item) => ({
              ...item,
              key: item.fid, // 使用更稳定的唯一标识作为key
            }));
            setData(dataWithKeys);
            // console.log(data);
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
    <>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1000,
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
                src="data:image/png;base64,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"
                width={700}
                height={245}
              />
            }
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
          />
        </Space>
      </Drawer>
      <Drawer
        title={(transactionType === "buy" ? "买入" : "卖出") + ":" + selectedFund}
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
              label="买入/卖出 价格"
              rules={[
                {
                  required: 'ture',
                  message: '请输入正确的价格',
                  // pattern: '^([1-9][0-9]*|0)$'
                  pattern: new RegExp(/^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/),
                },
              ]}
            >
              <Input placeholder="请输入买入/卖出价格：" />
            </Form.Item>
          </Col>
          <Col span={30}>

            <Form.Item
              name="num"
              label="买入/卖出 数量"
              rules={[
                {
                  required: 'true',
                  message: '请输入正确的数量',
                  pattern: '^([1-9][0-9]*|0)$'
                },
              ]}
            >
              <Input placeholder="请输入买入/卖出数量：" />
            </Form.Item>
            <Row span={50}>
              <Flex style={boxStyle} justify={'space-evenly'} align={'center'}>
                <Button type="primary" htmlType="submit">确认交易</Button>
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
  )
}

export default page
