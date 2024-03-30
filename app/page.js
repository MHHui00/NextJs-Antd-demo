"use client";
import React from 'react';
import { Table } from 'antd';
import { useLoginStore } from '@/store/useLoginStore';
import { redirect } from 'next/navigation'



// function Home() {
//   const loginStatus = useLoginStore(state => state.loginStatus);

//   const columns = [
//     {
//       title: 'Full Name',
//       width: 100,
//       dataIndex: 'name',
//       key: 'name',
//       fixed: 'left',
//     },
//     {
//       title: 'Age',
//       width: 100,
//       dataIndex: 'age',
//       key: 'age',
//       fixed: 'left',
//       defaultSortOrder: 'descend',
//       sorter: (a, b) => a.age - b.age,
//     },
//     {
//       title: 'Column 1',
//       dataIndex: 'address',
//       key: '1',
//       width: 150,
      
//     },
//     {
//       title: 'Column 2',
//       dataIndex: 'address',
//       key: '2',
//       width: 150,
//     },
//     {
//       title: 'Column 3',
//       dataIndex: 'address',
//       key: '3',
//       width: 150,
//     },
//     {
//       title: 'Column 4',
//       dataIndex: 'address',
//       key: '4',
//       width: 150,
//     },
//     {
//       title: 'Column 5',
//       dataIndex: 'address',
//       key: '5',
//       width: 150,
//     },
//     {
//       title: 'Column 6',
//       dataIndex: 'address',
//       key: '6',
//       width: 150,
//     },
//     {
//       title: 'Column 7',
//       dataIndex: 'address',
//       key: '7',
//       width: 150,
//     },
//     {
//       title: 'Column 8',
//       dataIndex: 'address',
//       key: '8',
//       width: 150,
//     },
//     {
//       title: 'Column 9',
//       dataIndex: 'address',
//       key: '9',
//       width: 150,
//     },
//     {
//       title: 'Column 10',
//       dataIndex: 'address',
//       key: '10',
//       width: 150,
//     },
//     {
//       title: 'Action',
//       key: 'operation',
//       fixed: 'right',
//       width: 100,
//       render: () => <a>Action</a>,
//     },
//   ];
//   const data = [];
//   for (let i = 0; i < 100; i++) {
//     data.push({
//       key: i,
//       name: `Edward ${i}`,
//       age: i,
//       address: `London Park no.${i} `,
//     });
//   }

//   if(JSON.parse(localStorage.getItem("loginStatus")) == undefined){
//     redirect('/login');
//   }else{
//     return (
//       <>
//         <Table
//           columns={columns}
//           dataSource={data}
//           scroll={{
//             x: 1500,
//             y: 600,
//           }}
//         />
//       </>
//     );
//   }
// }
const Home = () =>{
  redirect('/allFund');
  // return<>homepage</>
}

export default Home;  