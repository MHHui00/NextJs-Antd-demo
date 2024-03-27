import { PrismaClient } from '@prisma/client'
// import { getStaticProps } from 'next/dist/build/templates/pages';
import { Table } from 'antd'

const columns = [
    {
        title: 'uid',
        width: 20,
        dataIndex: 'uid',
        key: 'name',
        // fixed: 'left',
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
        // fixed: 'right',
        width: 30,
        render: () => <a>Action</a>,
    },
];

export function main(props) {
    // console.log(result);
    return (
        // <Table
        //     columns={columns}
        //     dataSource={props.result}
        //     scroll={{
        //         x: 1500,
        //         y: 600,
        //     }}
        // />
        <>qwe</>
    )
}

// export async function getStaticProps() {
//     const prisma = new PrismaClient();
//     const result = await prisma.user.findMany();
//     console.log(result);
//     return ({
//         props: {
//             result
//         }
//     })
// }
// Internal error: Error: Objects are not valid as a React child (found: object with keys {props}). If you meant to render a collection of children, use an array instead.
// at ak (/Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:47830)
// at ak (/Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:46847)
// at /Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:55430
// at /Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:56107
// at aD (/Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:56115)
// at Timeout._onTimeout (/Users/mhhui/Code/NextJS/NextJs-Antd-demo copy/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:4293)
// at listOnTimeout (node:internal/timers:569:17)
// at process.processTimers (node:internal/timers:512:7)
//