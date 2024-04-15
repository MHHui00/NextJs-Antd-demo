import { PrismaClient } from '@prisma/client'
// import md5 from 'crypto-js/md5';

const prisma = new PrismaClient();

export async function POST(request) {
  if (request.method === 'POST') {
    const uname = request.nextUrl.searchParams.get("username");
    const pw = request.nextUrl.searchParams.get("password");
    // console.log("inside api");
    
    try {
      const userNameIsExist = await prisma.user.findMany({
        where: {
          username: {
            equals: uname,
          }
        },
      });
      if (userNameIsExist.length > 0) {
        return new Response(JSON.stringify({ message: '用户名已经存在' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        const insertedRecord = await prisma.user.create({
          data: {
            username: uname,
            password: pw,
            admin: false,
          },
        });
        return new Response(JSON.stringify({ message: '注册成功' }), {
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