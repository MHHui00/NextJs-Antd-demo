import { PrismaClient } from '@prisma/client'
import md5 from 'crypto-js/md5';

export async function GET(request) {
    const uname = request.nextUrl.searchParams.get("username");
    // const pw = request.nextUrl.searchParams.get("password");
    const pw = md5(request.nextUrl.searchParams.get("password")).toString();
    console.log(pw);

    const prisma = new PrismaClient();
    const result = await prisma.user.findMany({
        where: {
            username: {
                equals: uname,
            },
            password: {
                equals: pw,
            },
        },
    });
    // console.log('result', result);
    if (result && result.length === 1) {
        const data = {
            uid: result[0].uid,
            username: result[0].username,
        };
        // console.log(data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    } else {
        return new Response('Error', {
            status: 500,
            statusText: 'Login failed'
        })
    }



    // // const data = JSON.stringify(result);

    // const processedData = result.map(item => {
    //     const processedItem = { ...item };
    //     // 遍历对象的属性
    //     for (let key in processedItem) {
    //         // 检查属性值是否为浮点数
    //         if (typeof processedItem[key] === 'number') {
    //             // 使用 toFixed() 将浮点数保留两位小数
    //             processedItem[key] = parseFloat(processedItem[key].toFixed(2));
    //         }
    //     }
    //     return processedItem;
    // });

    // return new Response(JSON.stringify(processedData), {
    //     status: 200,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // 'Content-Length': zixuan.length.toString()
    //     },
    // })


    //http://localhost:3000/api/login?uname=great
}