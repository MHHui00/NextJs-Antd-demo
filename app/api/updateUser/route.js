import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request) {
  if (request.method === 'POST') {
    const uid = +(request.nextUrl.searchParams.get("uid"));
    const password = request.nextUrl.searchParams.get("password");
    const admin = JSON.parse(request.nextUrl.searchParams.get("admin"));   //call api直接携带参数数据类型是字符串
    try {
      const User = await prisma.user.findUnique({
        where: {
          uid: uid
        }
      });

      if(User){
        await prisma.user.update({
          where: {
            uid: uid
          },
          data:{
            password: password,
            admin: admin
          }
        });
        return new Response(JSON.stringify({ message: '修改成功！' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }else{
        return new Response(JSON.stringify({ message: '找不到该用户' }), {
          status: 404,
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