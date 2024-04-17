import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request) {
  if (request.method === 'GET') {
    try {
    const userId = request.nextUrl.searchParams.get("userId");
      const allZhangBen = await prisma.zhangben.findMany({
        where:{
            uid: +userId,
        }
      });

      if (allZhangBen.length > 0) {
        const processedData = allZhangBen.map(item => {
            const processedItem = { ...item };
            // 遍历对象的属性
            for (let key in processedItem) {
              // 检查属性值是否为浮点数
              if (typeof processedItem[key] === 'number') {
                // 使用 toFixed() 将浮点数保留两位小数
                processedItem[key] = parseFloat(processedItem[key].toFixed(2));
              }
            }
            return processedItem;
          });
        return new Response(JSON.stringify(processedData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('数据库操作失败', error);
      return new Response(JSON.stringify({ message: '数据库操作失败' }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } else {
    return new Response(JSON.stringify({ message: `方法 ${request.method} 不被允许` }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}