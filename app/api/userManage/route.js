import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request) {
  if (request.method === 'GET') {
    try {
      const allUser = await prisma.user.findMany();

      if (allUser.length > 0) {
        return new Response(JSON.stringify(allUser), {
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